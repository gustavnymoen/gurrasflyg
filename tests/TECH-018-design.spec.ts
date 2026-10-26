import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  ACCENT,
  ACCENT_SOFT,
  ACCENT_STRONG,
  adminCard,
  animationsDone,
  backgroundOf,
  BRASS,
  CARD_SHADOW,
  contrast,
  css,
  DANGER,
  expectNoA11yViolations,
  expectTextMessage,
  FLOAT_SHADOW,
  INK,
  layer,
  LINE,
  LINE_STRONG,
  requireAdminPassword,
  signIn,
} from "./helpers";

// De tre designfunktionernas tester (TRIP-008, TRIP-020, TRIP-022), ihopslagna per
// sida och tillstånd så att varje sida laddas så få gånger som möjligt (TECH-018).
// Varje test heter efter alla krav det kontrollerar.

// The box around a field: <Field> draws the border and the ring, not the input itself
const fieldBox = (input: Locator) => input.locator("xpath=..");

// A computed colour as "rgb(…)": the browser reports oklch() colours (the destination tags) as written
const toRgb = (page: Page, color: string) =>
  page.evaluate((c) => {
    const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
    context.fillStyle = c;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  }, color);

const wordmark = (page: Page) => page.getByRole("banner").getByRole("link", { name: "Gurras Flyg" });
// The plane and its contrail inside the wordmark's ring
const plane = (page: Page) => wordmark(page).locator("svg");
const trail = (page: Page) => wordmark(page).locator("span[aria-hidden]");

const carousel = (page: Page) => page.getByRole("region", { name: "Omdömen" });
const focusedReview = (page: Page) => carousel(page).locator('article[aria-hidden="false"]');

async function expectWordmarkLinksHome(page: Page) {
  await expect(wordmark(page)).toBeVisible();
  await expect(wordmark(page)).toHaveAttribute("href", "/");
}

// True when the page is wider than the window, so that it scrolls sideways
const scrollsSideways = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

const top = async (locator: Locator) => (await locator.boundingBox())!.y;

// A primary button: the faint wine red tone, the fields' border and light text
async function expectTonedDown(button: Locator) {
  await expect(button).toHaveCSS("background-color", ACCENT_SOFT);
  await expect(button).toHaveCSS("border-top-color", LINE_STRONG);
  await expect(button).toHaveCSS("color", INK);
}

async function showDateError(page: Page) {
  const outbound = page.getByRole("combobox", { name: "Utresa" });
  await outbound.fill("2020-01-01");
  await outbound.press("Enter");
  await expect(page.getByText("Datumet har redan passerat.")).toBeVisible();
}

// The switch "Tur och retur" is in the calendar; its track is the span inside
const roundTripSwitch = async (page: Page) => {
  await page.getByRole("combobox", { name: "Utresa" }).click();
  const button = page.getByRole("switch", { name: "Tur och retur" });
  return { button, track: button.locator("span").first() };
};

// Changes a token on :root in the browser, as an edit of globals.css would
const setToken = (page: Page, name: string, value: string) =>
  page.addStyleTag({ content: `:root { ${name}: ${value} !important; }` });

// Records the name of every CSS animation that starts on the page, from the
// first moment, since the wordmark's take-off is removed once it has played
async function recordAnimations(page: Page) {
  await page.addInitScript(() => {
    const started: string[] = [];
    (window as unknown as { started: string[] }).started = started;
    document.addEventListener("animationstart", (e) => started.push(e.animationName), true);
  });
  return () => page.evaluate(() => (window as unknown as { started: string[] }).started);
}

test("TRIP-008-R3, R4 and R6 and TRIP-020-R1 and R2 the start page's header, text, order, contrast and fields", async ({
  page,
}) => {
  await page.goto("/");
  await expectWordmarkLinksHome(page);

  // R3: Bricolage Grotesque in the right sizes, and no Geist
  const h1 = page.getByRole("heading", { level: 1 });
  const h2 = page.getByRole("heading", { name: "Vad våra resenärer säger" });
  for (const element of [h1, h2, page.locator("body")]) {
    expect(await css(element, "font-family")).toMatch(/Bricolage/);
  }
  expect(await css(h1, "font-size")).toBe("76px");
  expect(await css(h2, "font-size")).toBe("26px");
  expect(await css(page.locator("body"), "font-size")).toBe("16px");
  expect(await css(h1, "text-wrap")).toMatch(/balance/);
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].map((f) => f.family).join(" "));
  expect(fonts).toMatch(/Bricolage/);
  expect(fonts).not.toMatch(/Geist/i);

  // TRIP-020-R2: heading, text, search form and reviews in that order, no gradient on the heading
  await expect(h1).toHaveText("Vi ordnar det ingen annan kan");
  const body = page.getByText("Ditt livs flygresa");
  const text = page.getByText("Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.");
  const from = page.getByRole("combobox", { name: "Från" });
  await expect(h2).toBeVisible();
  const order = [await top(h1), await top(text), await top(from), await top(h2)];
  expect(order).toEqual([...order].sort((a, b) => a - b));
  expect(await css(h1, "background-image")).toBe("none");

  // R4: text and placeholders have a contrast of at least 4.5:1
  const muted = page.getByText("Från", { exact: true });
  const placeholder = await css(from, "color", "::placeholder");
  expect(contrast(await css(h1, "color"), await backgroundOf(h1))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(await css(body, "color"), await backgroundOf(body))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(await css(muted, "color"), await backgroundOf(muted))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(placeholder, await backgroundOf(from))).toBeGreaterThanOrEqual(4.5);

  // R6: each field shows its label and placeholder and keeps its accessible name
  const form = page.locator("form");
  for (const label of ["Från", "Till", "Utresa", "Hemresa", "Resenärer"]) {
    await expect(form.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(from).toHaveAttribute("placeholder", "Varifrån?");
  await expect(page.getByRole("combobox", { name: "Till" })).toHaveAttribute("placeholder", "Vart vill du?");
  await expect(page.getByRole("group", { name: "Antal resenärer" })).toBeVisible();
});

test("TRIP-008-R4, R5 and R12 and TRIP-020-R3 and R4 and TRIP-022-R1 and R2 the start page's cards, photo and credit", async ({
  page,
}) => {
  await page.goto("/");
  const from = page.getByRole("combobox", { name: "Från" });
  const box = fieldBox(from);
  const searchCard = page.locator("section").filter({ has: from });

  // TRIP-008-R5 and TRIP-022-R1: the search form is a card with the fields' border colour
  expect(await css(searchCard, "box-shadow")).toContain(CARD_SHADOW);
  await expect(box).toHaveCSS("border-top-color", LINE_STRONG);
  await expect(searchCard).toHaveCSS("border-top-color", LINE_STRONG);

  // TRIP-008-R4: the field's border meets both the card around it and the field's own surface
  const border = await css(box, "border-top-color");
  expect(contrast(border, await backgroundOf(box.locator("xpath=../..")))).toBeGreaterThanOrEqual(3);
  expect(contrast(border, await backgroundOf(box))).toBeGreaterThanOrEqual(3);

  // TRIP-020-R3: the photo is behind the heading, and the credit with both links is in the footer
  const photo = page.locator('img[src*="skymning"]');
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  const photoBox = (await photo.boundingBox())!;
  const h1Box = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
  expect(photoBox.y).toBeLessThanOrEqual(h1Box.y);
  expect(photoBox.y + photoBox.height).toBeGreaterThan(h1Box.y + h1Box.height);
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons");
  await expect(footer.getByRole("link", { name: "CC BY-SA 2.0" })).toHaveAttribute(
    "href",
    "https://creativecommons.org/licenses/by-sa/2.0",
  );
  await expect(footer.getByRole("link", { name: "Wikimedia Commons" })).toHaveAttribute(
    "href",
    /^https:\/\/commons\.wikimedia\.org\/wiki\/File:Boeing_757_climbing_after_the_sunset/,
  );

  // TRIP-020-R4: the card in focus is at most 15 × 12 rem, with the card shadow and the name in brass
  const card = focusedReview(page);
  await expect(card).toHaveCount(1);
  const cardBox = (await card.boundingBox())!;
  expect(cardBox.width).toBeLessThanOrEqual(15 * 16);
  expect(cardBox.height).toBeLessThanOrEqual(12 * 16);
  expect(await css(card, "box-shadow")).toContain(CARD_SHADOW);
  await expect(card.getByText(/^– /)).toHaveCSS("color", BRASS);

  // TRIP-022-R2: every review card has the fields' border colour, also the one in focus
  for (const review of await carousel(page).locator("article").all()) {
    await expect(review).toHaveCSS("border-top-color", LINE_STRONG);
  }

  // TRIP-008-R12 (and TRIP-020 accessibility): axe on the start page with the photo
  await expectNoA11yViolations(page);
});

test("TRIP-008-R4, R5 and R6 and TRIP-022-R3 a focused field has the accent border and ring, and the suggestions float", async ({
  page,
}) => {
  await page.goto("/");
  const from = page.getByRole("combobox", { name: "Från" });
  await from.fill("lon");
  await expect(fieldBox(from)).toHaveCSS("border-color", ACCENT_STRONG);
  await expect(fieldBox(from)).not.toHaveCSS("box-shadow", "none");

  const suggestions = page.getByRole("listbox");
  expect(await css(suggestions, "box-shadow")).toContain(FLOAT_SHADOW);
  await expect(suggestions).toHaveCSS("border-top-color", LINE);
});

test("TRIP-008-R4 and R6 the switch is drawn with the accent when on, and has a visible border when off", async ({
  page,
}) => {
  await page.goto("/");
  const { button, track } = await roundTripSwitch(page);
  await expect(button).toBeChecked();
  await expect(track).toHaveCSS("background-color", ACCENT);

  // The switch turned off shows only its border, against the calendar
  await button.click();
  await expect(button).not.toBeChecked();
  const calendar = page.getByRole("dialog", { name: "Välj datum" });
  await animationsDone(calendar);
  expect(contrast(await css(track, "border-top-color"), await backgroundOf(calendar))).toBeGreaterThanOrEqual(3);
});

test("TRIP-008-R6, R7 and R12 an invalid date gives a red border, red text without a box, and no axe violations", async ({
  page,
}) => {
  await page.goto("/");
  await showDateError(page);
  await expectTextMessage(page.getByRole("alert").filter({ hasText: "Datumet har redan passerat." }), DANGER);
  await expectNoA11yViolations(page);

  const date = page.getByRole("combobox", { name: "Utresa" });
  await date.blur();
  await expect(fieldBox(date)).toHaveCSS("border-color", DANGER);
  await expect(page.getByText("Datumet har redan passerat.")).toHaveCSS("color", DANGER);
});

test("TRIP-008-R4, R8 and R9 keyboard focus shows a visible ring, and a disabled button is faded", async ({ page }) => {
  await page.goto("/");
  // Tab from the start of the page: first the wordmark in the header (TRIP-020-R1),
  // then the selected tab (TRIP-018-R1), then the first field, then on to a button
  await page.keyboard.press("Tab");
  await expect(wordmark(page)).toBeFocused();
  await expect(wordmark(page)).toHaveCSS("outline-color", ACCENT_STRONG);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("tab", { name: "Flyg" })).toBeFocused();
  await page.keyboard.press("Tab");
  const from = page.getByRole("combobox", { name: "Från" });
  await expect(from).toBeFocused();
  await expect(fieldBox(from)).not.toHaveCSS("box-shadow", "none");

  const more = page.getByRole("button", { name: "Fler resenärer" });
  while (!(await more.evaluate((el) => el === document.activeElement))) await page.keyboard.press("Tab");
  await expect(more).toHaveCSS("outline-style", "solid");
  await expect(more).toHaveCSS("outline-width", "2px");
  await expect(more).toHaveCSS("outline-color", ACCENT_STRONG);
  // R4: the focus ring meets the card around the field
  const card = await backgroundOf(fieldBox(from).locator("xpath=../.."));
  expect(contrast(await css(more, "outline-color"), card)).toBeGreaterThanOrEqual(3);

  // R8: with one traveller "Färre resenärer" is disabled
  const fewer = page.getByRole("button", { name: "Färre resenärer" });
  await expect(fewer).toHaveAttribute("aria-disabled", "true");
  await expect(fewer).toHaveCSS("cursor", "not-allowed");
  expect(Number(await css(fewer, "opacity"))).toBeLessThan(1);
});

test("TRIP-008-R1 and TRIP-020-R1 changing the font and the accent changes headings, wordmark, buttons, focus ring, switch and suggestions", async ({
  page,
}) => {
  const green = "rgb(0, 128, 0)";
  await page.goto("/admin/login");
  await setToken(page, "--font-display", "monospace");
  await setToken(page, "--color-accent", green);
  await expect(page.getByRole("heading", { name: "Admin" })).toHaveCSS("font-family", "monospace");
  // The primary button has the accent at 30 % (TRIP-022-R4), reported as color(srgb …)
  await expect(page.getByRole("button", { name: "Logga in" })).toHaveCSS(
    "background-color",
    "color(srgb 0 0.501961 0 / 0.3)",
  );

  await page.goto("/");
  // The chosen suggestion has the accent mixed with transparency, so compare before and after
  await page.getByRole("combobox", { name: "Från" }).fill("lon");
  const suggestion = page.getByRole("option", { selected: true });
  const before = await css(suggestion, "background-color");
  await setToken(page, "--font-display", "monospace");
  // The accent is two tokens: the fill (buttons, switch, suggestion) and the
  // strong accent (focus ring, focused field), so both are changed
  await setToken(page, "--color-accent", green);
  await setToken(page, "--color-accent-strong", green);
  for (const heading of await page.getByRole("heading").all()) {
    await expect(heading).toHaveCSS("font-family", "monospace");
  }
  await expect(wordmark(page)).toHaveCSS("font-family", "monospace");
  await expect(suggestion).not.toHaveCSS("background-color", before);
  await page.keyboard.press("Escape");

  const { track } = await roundTripSwitch(page);
  await expect(track).toHaveCSS("background-color", green);

  // Back from Hemresa (which opens the calendar) with Escape and Tab, so that
  // the button gets focus from the keyboard and shows the ring
  const more = page.getByRole("button", { name: "Fler resenärer" });
  await more.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Tab");
  await expect(more).toHaveCSS("outline-color", green);
});

test("TRIP-008-R5, R7, R8 and R12 and TRIP-020-R1 and R3 and TRIP-022-R1 and R4 the sign-in page", async ({ page }) => {
  await page.goto("/admin/login");
  await expectWordmarkLinksHome(page);
  await expect(page.getByRole("contentinfo")).not.toContainText("Bill Abbott");

  // The sign-in form is a card with the fields' border colour
  const loginCard = page.locator("section").filter({ has: page.getByLabel("Lösenord") });
  expect(await css(loginCard, "box-shadow")).toContain(CARD_SHADOW);
  await expect(loginCard).toHaveCSS("border-top-color", LINE_STRONG);

  // The primary button is a pill, toned down, and gets a wine red border on hover
  const login = page.getByRole("button", { name: "Logga in" });
  await expect(login).toHaveCSS("border-top-left-radius", "999px");
  await expectTonedDown(login);
  // The button is translucent, so its colour is laid over the card behind it
  const behind = await backgroundOf(login.locator("xpath=.."));
  const fill = layer(await css(login, "background-color"), behind);
  expect(contrast(await css(login, "color"), fill)).toBeGreaterThanOrEqual(4.5);
  await login.hover();
  await expect(login).toHaveCSS("border-top-color", ACCENT_STRONG);

  // A wrong password is red text without a box
  await page.getByLabel("Lösenord").fill("definitely-not-the-password");
  await login.click();
  await expect(page.getByText("Fel lösenord.")).toBeVisible();
  await expectTextMessage(page.getByRole("alert").filter({ hasText: "Fel lösenord." }), DANGER);
  await expectNoA11yViolations(page);

  await wordmark(page).click();
  await expect(page).toHaveURL(/\/$/);
});

test("TRIP-020-R1 and R5 the plane takes off and hops, and the carousel slides", async ({ page }) => {
  const started = await recordAnimations(page);
  await page.goto("/");
  await expect.poll(started).toEqual(expect.arrayContaining(["takeoff", "trail"]));

  // With the pointer over the wordmark, the plane makes a small hop
  await wordmark(page).hover();
  await expect.poll(started).toContain("hop");

  expect(await css(focusedReview(page), "transition-property")).toContain("transform");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("TRIP-020-R1 and R5 the wordmark doesn't move, and the carousel changes card without sliding", async ({
    page,
  }) => {
    const started = await recordAnimations(page);
    await page.goto("/");
    await expect(plane(page)).toHaveCSS("animation-name", "none");
    await expect(trail(page)).toHaveCSS("animation-name", "none");
    await wordmark(page).hover();
    await expect(plane(page).locator("xpath=..")).toHaveCSS("animation-name", "none");
    expect(await started()).toEqual([]);

    await expect(focusedReview(page)).toHaveCount(1);
    const first = await focusedReview(page).locator("h3").textContent();
    await page.getByRole("button", { name: "Nästa omdöme" }).click();
    await expect(focusedReview(page).locator("h3")).not.toHaveText(first!);
    expect(await css(focusedReview(page), "transition-property")).not.toContain("transform");
  });
});

test("TRIP-020-R1 and R6 and TRIP-022-R1 and R4 the admin page: header, card borders, aircraft form and buttons, and no sideways scroll on a phone", async ({
  page,
}) => {
  requireAdminPassword();
  await signIn(page);
  await expectWordmarkLinksHome(page);
  for (const title of ["Klasser & addons", "Plan", "Omdömen"]) {
    await expect(adminCard(page, title)).toHaveCSS("border-top-color", LINE_STRONG);
  }

  await page.getByRole("button", { name: "Lägg till plan" }).click();
  const form = page.locator("form").filter({ has: page.getByLabel("Planets namn") });
  await expect(form).toHaveCSS("border-top-color", LINE_STRONG);
  await expectTonedDown(form.getByRole("button", { name: "Spara", exact: true }));
  const cancel = form.getByRole("button", { name: "Avbryt" });
  await expect(cancel).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(cancel).toHaveCSS("border-top-color", LINE_STRONG);
  await cancel.hover();
  await expect(cancel).toHaveCSS("border-top-color", ACCENT_STRONG);
  await expectNoA11yViolations(page);

  await cancel.click();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Lägg till plan" })).toBeVisible();
  expect(await scrollsSideways(page)).toBe(false);
});

const NO_FLIGHTS = "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand.";

test("TRIP-013-R5 and R8 the charter list: every category and access tag has its own colour with enough contrast, and the notice is red", async ({
  page,
}) => {
  await page.goto("/charter");
  await expect(page.getByRole("heading", { level: 2, name: "96 destinationer" })).toBeVisible();

  // R5: each tag text has one colour of its own, and text and background meet 4.5:1
  const tags = await page.locator(".tag").evaluateAll((els) =>
    els.map((el) => ({ text: el.textContent!, background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color })),
  );
  const colours = new Map<string, string>();
  for (const tag of tags) {
    const background = await toRgb(page, tag.background);
    expect(contrast(await toRgb(page, tag.color), background), tag.text).toBeGreaterThanOrEqual(4.5);
    colours.set(tag.text, background);
  }
  expect(colours.size).toBe(18);
  expect(new Set(colours.values()).size).toBe(colours.size);

  // R8: the notice is red text, and it meets 4.5:1 against the card
  await page.goto("/charter?sok=chernobyl");
  const notice = page.getByText(NO_FLIGHTS);
  await expect(notice).toHaveCSS("color", DANGER);
  expect(contrast(DANGER, await backgroundOf(notice))).toBeGreaterThanOrEqual(4.5);
});

test("TRIP-013-R7 and R8 the destination page: a large photo, and a red alert without a box when there are no flights", async ({
  page,
}) => {
  await page.goto("/charter/teufelsberg");
  const photo = page.locator("figure img");
  await expect(photo).toBeVisible();
  const box = (await photo.boundingBox())!;
  expect(box.width).toBeGreaterThan(800);
  expect(box.width / box.height).toBeCloseTo(16 / 9, 1);

  await page.goto("/charter/chernobyl-pripyat");
  const alert = page.getByRole("alert").filter({ hasText: NO_FLIGHTS });
  await expectTextMessage(alert, DANGER);
  expect(contrast(DANGER, await backgroundOf(alert))).toBeGreaterThanOrEqual(4.5);
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  // The date group and Resenärer on a phone changed with TRIP-009 and are checked by TRIP-009-R1
  test("TRIP-008-R3 and R12 and TRIP-020-R6 the start page and the sign-in page: smaller heading, no sideways scroll, Från and Till stacked", async ({
    page,
  }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    expect(await css(h1, "font-size")).toBe("42px");
    expect(await scrollsSideways(page)).toBe(false);

    const box = async (label: string) =>
      (await page.getByText(label, { exact: true }).locator("xpath=..").boundingBox())!;
    const [from, to] = [await box("Från"), await box("Till")];
    expect(to.width).toBeCloseTo(from.width, 0);
    expect(to.x).toBeCloseTo(from.x, 0);
    expect(to.y).toBeGreaterThan(from.y);

    await expect(focusedReview(page)).toHaveCount(1);
    await expectNoA11yViolations(page);

    await page.goto("/admin/login");
    await expect(h1).toBeVisible();
    expect(await scrollsSideways(page)).toBe(false);
  });

  test.describe("320 px wide", () => {
    test.use({ viewport: { width: 320, height: 640 } });

    test("TRIP-013-R5 and R9 the charter list and the destination pages fit a 320 px screen", async ({ page }) => {
      for (const path of ["/charter", "/charter?varldsdel=Antarctica", "/charter/chernobyl-pripyat", "/charter/teufelsberg"]) {
        await page.goto(path);
        await expect(page.getByRole("main").getByRole("heading").first()).toBeVisible();
        expect(await scrollsSideways(page), path).toBe(false);
      }
    });
  });
});
