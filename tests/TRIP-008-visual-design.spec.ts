import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  ACCENT,
  ACCENT_STRONG,
  CARD_SHADOW,
  css,
  DANGER,
  EDGE,
  expectNoA11yViolations,
  expectTextMessage,
  FLOAT_SHADOW,
} from "./helpers";

// WCAG contrast ratio between two colours given as "rgb(…)" or "rgba(…)".
// A translucent colour is first laid over the background.
function contrast(foreground: string, background: string) {
  const parse = (c: string) => c.match(/[\d.]+/g)!.map(Number);
  const [br, bg, bb] = parse(background);
  const [fr, fg, fb, alpha = 1] = parse(foreground);
  const blend = (f: number, b: number) => f * alpha + b * (1 - alpha);
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const l1 = luminance([blend(fr, br), blend(fg, bg), blend(fb, bb)]);
  const l2 = luminance([br, bg, bb]);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// The first non-transparent background behind an element (the surfaces are opaque)
function backgroundOf(locator: Locator) {
  return locator.evaluate((el) => {
    for (let e: Element | null = el; e; e = e.parentElement) {
      const bg = getComputedStyle(e).backgroundColor;
      if (bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") return bg;
    }
    return getComputedStyle(document.body).backgroundColor;
  });
}

// The box around a field: <Field> draws the border and the ring, not the input itself
const fieldBox = (input: Locator) => input.locator("xpath=..");

async function showDateError(page: Page) {
  await page.getByLabel("Datum").fill("2020-01-01");
  await expect(page.getByText("Datumet har redan passerat.")).toBeVisible();
}

async function signInWrong(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Lösenord").fill("definitely-not-the-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await expect(page.getByText("Fel lösenord.")).toBeVisible();
}

// Changes a token on :root in the browser, as an edit of globals.css would
const setToken = (page: Page, name: string, value: string) =>
  page.addStyleTag({ content: `:root { ${name}: ${value} !important; }` });

test("TRIP-008-R1 changing --font-display changes every heading", async ({ page }) => {
  await page.goto("/admin/login");
  await setToken(page, "--font-display", "monospace");
  await expect(page.getByRole("heading", { name: "Admin" })).toHaveCSS("font-family", "monospace");

  await page.goto("/");
  await setToken(page, "--font-display", "monospace");
  for (const heading of await page.getByRole("heading").all()) {
    await expect(heading).toHaveCSS("font-family", "monospace");
  }
});

test("TRIP-008-R1 changing the accent changes buttons, focus ring, checkbox and suggestions", async ({ page }) => {
  const green = "rgb(0, 128, 0)";
  await page.goto("/admin/login");
  await setToken(page, "--color-accent", green);
  await expect(page.getByRole("button", { name: "Logga in" })).toHaveCSS("background-color", green);

  await page.goto("/");
  // The chosen suggestion has the accent mixed with transparency, so compare before and after
  await page.getByRole("combobox", { name: "Från" }).fill("lon");
  const suggestion = page.getByRole("option", { selected: true });
  const before = await css(suggestion, "background-color");
  // The accent is two tokens: the fill (buttons, checkbox, suggestion) and the
  // strong accent (focus ring, focused field), so both are changed
  await setToken(page, "--color-accent", green);
  await setToken(page, "--color-accent-strong", green);
  await expect(suggestion).not.toHaveCSS("background-color", before);
  await page.keyboard.press("Escape");

  const checkbox = page.getByRole("checkbox", { name: "Boka returresa" });
  await checkbox.check();
  await expect(checkbox).toHaveCSS("background-color", green);

  const more = page.getByRole("button", { name: "Fler resenärer" });
  await more.focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(more).toHaveCSS("outline-color", green);
});

test("TRIP-008-R3 headings and text are set in Bricolage Grotesque in the right sizes", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  const h2 = page.getByRole("heading", { name: "Vad våra resenärer säger" });
  for (const element of [h1, h2, page.locator("body")]) {
    expect(await css(element, "font-family")).toMatch(/Bricolage/);
  }
  expect(await css(h1, "font-size")).toBe("76px");
  expect(await css(h2, "font-size")).toBe("26px");
  expect(await css(page.locator("body"), "font-size")).toBe("16px");
  expect(await css(h1, "text-wrap")).toMatch(/balance/);

  await page.setViewportSize({ width: 390, height: 800 });
  expect(await css(h1, "font-size")).toBe("42px");
});

test("TRIP-008-R3 the page no longer loads Geist", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => [...document.fonts].map((f) => f.family).join(" "));
  expect(fonts).toMatch(/Bricolage/);
  expect(fonts).not.toMatch(/Geist/i);
});

test("TRIP-008-R4 the primary button has the accent and a focused field the accent border", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("button", { name: "Logga in" })).toHaveCSS("background-color", ACCENT);

  await page.goto("/");
  const from = page.getByRole("combobox", { name: "Från" });
  await from.focus();
  await expect(fieldBox(from)).toHaveCSS("border-color", ACCENT_STRONG);
  await expect(fieldBox(from)).not.toHaveCSS("box-shadow", "none");
});

test("TRIP-008-R4 text and placeholders have a contrast of at least 4.5:1", async ({ page }) => {
  await page.goto("/");
  const body = page.getByText("Ditt livs flygresa");
  const muted = page.getByText("Från", { exact: true });
  const from = page.getByRole("combobox", { name: "Från" });
  const placeholder = await css(from, "color", "::placeholder");

  expect(contrast(await css(page.locator("h1"), "color"), await backgroundOf(page.locator("h1")))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(await css(body, "color"), await backgroundOf(body))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(await css(muted, "color"), await backgroundOf(muted))).toBeGreaterThanOrEqual(4.5);
  expect(contrast(placeholder, await backgroundOf(from))).toBeGreaterThanOrEqual(4.5);
  const datePlaceholder = page.getByText("Välj datum");
  expect(contrast(await css(datePlaceholder, "color"), await backgroundOf(datePlaceholder))).toBeGreaterThanOrEqual(4.5);
});

test("TRIP-008-R4 field borders and the focus ring have a contrast of at least 3:1", async ({ page }) => {
  await page.goto("/");
  const box = fieldBox(page.getByRole("combobox", { name: "Från" }));
  // The border meets both the card around it and the field's own surface
  const border = await css(box, "border-top-color");
  const card = await backgroundOf(box.locator("xpath=../.."));
  expect(contrast(border, card)).toBeGreaterThanOrEqual(3);
  expect(contrast(border, await backgroundOf(box))).toBeGreaterThanOrEqual(3);

  const checkbox = page.getByRole("checkbox", { name: "Boka returresa" });
  expect(contrast(await css(checkbox, "border-top-color"), card)).toBeGreaterThanOrEqual(3);

  const more = page.getByRole("button", { name: "Fler resenärer" });
  await more.focus();
  expect(contrast(await css(more, "outline-color"), card)).toBeGreaterThanOrEqual(3);
});

test("TRIP-008-R5 the search form and the sign-in form are cards that stand out", async ({ page }) => {
  await page.goto("/");
  const searchCard = page.locator("section").filter({ has: page.getByRole("combobox", { name: "Från" }) });
  await expect(searchCard).toHaveCSS("border-top-color", EDGE);
  expect(await css(searchCard, "box-shadow")).toContain(CARD_SHADOW);

  await page.getByRole("combobox", { name: "Från" }).fill("lon");
  expect(await css(page.getByRole("listbox"), "box-shadow")).toContain(FLOAT_SHADOW);

  await page.goto("/admin/login");
  const loginCard = page.locator("section").filter({ has: page.getByLabel("Lösenord") });
  await expect(loginCard).toHaveCSS("border-top-color", EDGE);
  expect(await css(loginCard, "box-shadow")).toContain(CARD_SHADOW);
});

test("TRIP-008-R6 each field shows its label and placeholder and keeps its accessible name", async ({ page }) => {
  await page.goto("/");
  const form = page.locator("form");
  for (const label of ["Från", "Till", "Datum", "Resenärer"]) {
    await expect(form.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.getByRole("combobox", { name: "Från" })).toHaveAttribute("placeholder", "Varifrån?");
  await expect(page.getByRole("combobox", { name: "Till" })).toHaveAttribute("placeholder", "Vart vill du?");
  await expect(page.getByText("Välj datum")).toBeVisible();
  await expect(page.getByLabel("Datum")).toBeVisible();
  await expect(page.getByRole("group", { name: "Antal resenärer" })).toBeVisible();
});

test("TRIP-008-R6 a focused field has the accent border", async ({ page }) => {
  await page.goto("/");
  const to = page.getByRole("combobox", { name: "Till" });
  await to.focus();
  await expect(fieldBox(to)).toHaveCSS("border-color", ACCENT_STRONG);
});

test("TRIP-008-R6 an invalid date gives a red border and red text under the field", async ({ page }) => {
  await page.goto("/");
  await showDateError(page);
  const date = page.getByLabel("Datum");
  await date.blur();
  // The date input sits in a wrapper for its placeholder, inside the field's box
  await expect(date.locator("xpath=../..")).toHaveCSS("border-color", DANGER);
  await expect(page.getByText("Datumet har redan passerat.")).toHaveCSS("color", DANGER);
});

test("TRIP-008-R6 the checkbox is drawn with the accent when chosen", async ({ page }) => {
  await page.goto("/");
  const checkbox = page.getByRole("checkbox", { name: "Boka returresa" });
  await checkbox.check();
  await expect(checkbox).toBeChecked();
  await expect(checkbox).toHaveCSS("background-color", ACCENT);
});

test("TRIP-008-R7 a date error is red text without a box", async ({ page }) => {
  await page.goto("/");
  await showDateError(page);
  await expectTextMessage(page.getByRole("alert").filter({ hasText: "Datumet har redan passerat." }), DANGER);
});

test("TRIP-008-R7 a wrong password is red text without a box", async ({ page }) => {
  await signInWrong(page);
  await expectTextMessage(page.getByRole("alert").filter({ hasText: "Fel lösenord." }), DANGER);
});

test("TRIP-008-R8 buttons are pills, and a disabled button is faded", async ({ page }) => {
  await page.goto("/admin/login");
  const login = page.getByRole("button", { name: "Logga in" });
  await expect(login).toHaveCSS("background-color", ACCENT);
  await expect(login).toHaveCSS("border-top-left-radius", "999px");

  await page.goto("/");
  // With one traveller "Färre resenärer" is disabled
  const fewer = page.getByRole("button", { name: "Färre resenärer" });
  await expect(fewer).toBeDisabled();
  await expect(fewer).toHaveCSS("cursor", "not-allowed");
  expect(Number(await css(fewer, "opacity"))).toBeLessThan(1);
});

test("TRIP-008-R9 keyboard focus shows a visible ring", async ({ page }) => {
  await page.goto("/");
  // Tab from the start of the page: first the wordmark in the header (TRIP-020-R1),
  // then the first field, then on to a button
  await page.keyboard.press("Tab");
  const wordmark = page.getByRole("banner").getByRole("link", { name: "Gurras Flyg" });
  await expect(wordmark).toBeFocused();
  await expect(wordmark).toHaveCSS("outline-color", ACCENT_STRONG);
  await page.keyboard.press("Tab");
  const from = page.getByRole("combobox", { name: "Från" });
  await expect(from).toBeFocused();
  await expect(fieldBox(from)).not.toHaveCSS("box-shadow", "none");

  const more = page.getByRole("button", { name: "Fler resenärer" });
  while (!(await more.evaluate((el) => el === document.activeElement))) await page.keyboard.press("Tab");
  await expect(more).toHaveCSS("outline-style", "solid");
  await expect(more).toHaveCSS("outline-width", "2px");
  await expect(more).toHaveCSS("outline-color", ACCENT_STRONG);
});

test("TRIP-008-R12 axe finds no WCAG A or AA violations on the start page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("combobox", { name: "Från" })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-008-R12 axe finds no violations with a date error shown", async ({ page }) => {
  await page.goto("/");
  await showDateError(page);
  await expectNoA11yViolations(page);
});

test("TRIP-008-R12 axe finds no violations on the sign-in page with a wrong password", async ({ page }) => {
  await signInWrong(page);
  await expectNoA11yViolations(page);
});
