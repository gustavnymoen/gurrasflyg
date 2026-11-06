import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { actionsOf, type AgentState, runTool, ToolError, TOOLS } from "./agent-tools";
import { pageText, readPage } from "./agent-page";
import { type AgentAction, type AgentContext, BOOK_MARKER, MAX_TOOL_CALLS, takeMarkers } from "./agent-rules";
import { type ChatClient, defaultClient, MAX_TOKENS, MODEL } from "./chat";
import { buildSystemPrompt } from "./chat-prompt";
import { type ChatMessage, cutToWhole } from "./chat-rules";

// Agentläget (TRIP-030-R2): modellen får verktyg och frågar dem i en loop på servern tills den svarar
// med text eller har gjort MAX_TOOL_CALLS anrop. Verktygen läser bara; det som ska hända på sidan
// kommer tillbaka som åtgärder, och bokningen kommer aldrig härifrån (R8).

// Hela frågan, med alla anrop, ska hinna före routens 60 sekunder (R9). Efter SOFT_MS tvingas ett svar.
const BUDGET_MS = 55_000;
const SOFT_MS = 35_000;
const MIN_CALL_MS = 5_000;

const AGENT_RULES = `# Agent mode
The visitor pressed "Hjälp mig": now you can do things on the site with your tools, besides answering. Everything above still holds, and you are still Agneta, grumpy as before, in every answer: when you ask, confirm, refuse and report a problem too. Never write a plain, friendly assistant text.
- Before each question you get a <page> block: which page the visitor is on and what they have chosen (not personal). The visitor can click around too. Base your answer on that page, not on what you opened last, and never undo what the visitor chose.
- Steer the page with the tools. Never name a trip or a price from memory: look it up with find_trips first, and say only what it returned. Recommend one trip in your own voice; the visitor decides. If no trip runs on the dates, say so, suggest other dates and do not open any booking page.
- The booking's steps are: the results (choose trips), the plan step (aircraft and travellers per class, for each trip), Resenärer (the visitor's details), then payment. Never skip one.
- If the visitor gives a destination, dates and a number of travellers in one sentence, look up the trips and, when there are trips both ways, open the plan step directly with one outbound and one return trip (show_plan), and say which you chose and why. If the departure airport is not said, ask once: Arlanda (ARN) or Köpenhamn (CPH). Go on to Resenärer (show_travellers) only when aircraft and classes are set for both trips; it is refused before that.
- On the plan step, look the aircraft up with list_aircraft, never from memory, and say only what it returned. Recommend one aircraft per trip in your own voice, from the real prices and the number of travellers, in a funny, negative way, and let the visitor decide. A charter trip flies when its timetable says: never quote a flight time or an arrival from an aircraft. When the visitor agrees, set it with set_plan (one call per trip). If it is refused, say what was refused, in character, and offer another choice.
- The class of each traveller is decided in the plan step only, as the numbers per class, and cannot be changed later: the Resenärer page shows it as text. Ask about add-ons only once the classes are set. If the visitor wants another class while on Resenärer, never say you change it there: send them back to the plan step with set_plan (new numbers per class) and say that the add-ons they chose on that trip are removed.
- Ask once whether the visitor sees an add-on in the chosen classes they like (list_addons), not one at a time, and set what they choose with set_addons. Ask once too whether they see an extra they like, and how they want to pay. Write the choices with set_extras and set_payment.
- You never see names, ages, contact details or the answers to the three questions, and you never ask for them. Tell the visitor to fill them in on the Resenärer page themselves, and wait.
- When the traveller form is valid, the trips are chosen and a payment method is set, use summarise and give the visitor a short summary (destination, dates, trips, travellers, extras, total), and end your answer with a last line of exactly ${BOOK_MARKER}: the site then shows the button "Boka och betala". You cannot book yourself. Only add the line when the form is valid and a payment method is set, and never otherwise.
- If a tool answers with an error, read it, correct the call or tell the visitor in character what is wrong.`;

export type AgentReply = { reply: string; actions: AgentAction[]; book: boolean };

type Block = Anthropic.ContentBlockParam;

// Svaret på frågan i agentläget, eller null om API:et vägrar eller svarar med ingenting. Kastar när anropet misslyckas.
export async function askAgent(
  messages: ChatMessage[],
  context: AgentContext,
  client: ChatClient = defaultClient(),
): Promise<AgentReply | null> {
  const started = Date.now();
  const info = await readPage(context.url, new Date());
  const state: AgentState = {
    url: info.kind === "unknown" ? "" : context.url,
    extras: context.extras,
    payment: context.payment,
    valid: context.valid,
    actions: {},
  };
  // Sidans läge hör till den sista frågan, inte till systemtexten, som ska vara densamma för att cachas
  const last = messages.at(-1)!;
  const convo: Anthropic.MessageParam[] = [
    ...messages.slice(0, -1),
    { role: "user", content: [{ type: "text", text: pageText(info, context) }, { type: "text", text: last.content }] },
  ];
  const system = [
    { type: "text" as const, text: await buildSystemPrompt() },
    { type: "text" as const, text: AGENT_RULES },
  ];

  let calls = 0;
  for (;;) {
    const elapsed = Date.now() - started;
    const mustAnswer = calls >= MAX_TOOL_CALLS || elapsed > SOFT_MS;
    const response = await client.messages.create(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        cache_control: { type: "ephemeral" },
        system,
        tools: TOOLS,
        ...(mustAnswer && { tool_choice: { type: "none" as const } }),
        messages: convo,
      },
      { timeout: Math.max(MIN_CALL_MS, Math.min(50_000, BUDGET_MS - elapsed)), maxRetries: 0 },
    );
    console.log("chat usage", JSON.stringify(response.usage));

    const uses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    if (response.stop_reason === "tool_use" && uses.length > 0 && !mustAnswer) {
      convo.push({ role: "assistant", content: response.content });
      const results: Block[] = [];
      for (const use of uses) results.push(await toolResult(use, ++calls, state));
      convo.push({ role: "user", content: results });
      continue;
    }

    const cut = response.stop_reason === "max_tokens";
    if (cut) console.log("chat cut at the token limit", JSON.stringify(response.usage));
    const text = response.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("").trim();
    if (response.stop_reason === "refusal" || text === "") return null;
    const { text: reply, book } = takeMarkers(cut ? cutToWhole(text) : text);
    return { reply, actions: actionsOf(state), book: book && (await canBook(state)) };
  }
}

// Ett verktygsanrop som ett svar till modellen. Över taket och fel argument ger en felbeskrivning, aldrig ett kast.
async function toolResult(use: Anthropic.ToolUseBlock, count: number, state: AgentState): Promise<Block> {
  const result = (content: string, is_error = false): Block => ({ type: "tool_result", tool_use_id: use.id, content, is_error });
  if (count > MAX_TOOL_CALLS) return result("Tool call limit reached. Answer the visitor now with what you have.", true);
  try {
    return result(await runTool(use.name, use.input, state));
  } catch (error) {
    if (error instanceof ToolError) return result(error.message, true);
    console.error("agent tool failed", error instanceof Error ? error.name : "unknown"); // aldrig felet: det kan bära data
    return result("The tool failed. Tell the visitor in character that something broke.", true);
  }
}

// Knappen får bara erbjudas när allt är klart (R7, R8): sidan är Resenärer eller betalning med båda
// resorna valda och deras plan och klasser satta (TRIP-040), formuläret stämmer och ett betalsätt är valt. Servern bokar ändå inget; det gör knappen.
async function canBook(state: AgentState) {
  if (!state.valid || !state.payment) return false;
  const info = await readPage(state.url, new Date());
  return info.kind === "trip" && (info.step === "travellers" || info.step === "payment") && !!info.data.legs;
}
