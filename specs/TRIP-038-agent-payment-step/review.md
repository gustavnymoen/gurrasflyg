# TRIP-038 Review

Reviewer: code-reviewer agent, 2026-11-06, following `wiki/system/code-review.md`.

**Result: Passed.** No must-fix findings.

The change follows R1 and R2. Agneta asks about payment only on the payment page, through the new `show_payment` tool. The `[[BOOK]]` button is offered by `canBook()`, and accepted by `bookNow()`, only on `/boka/betala`. The unit and browser tests match the requirements.

## Security

Passed. No new input, action or data. `show_payment` takes no arguments and only builds a URL with `paymentUrl()`. The booking action is unchanged, `bookNow()` is stricter than before, and `canBook()` still gates the marker on the server. `/security-review` was not run (the card says it is not needed).

## Must fix

None.

## Should fix

- `verification.md` and `review.md` were still templates. Fixed: both are filled in.

## Suggestions

- `lib/agent.ts`: leftover parentheses around `info.step === "payment"`. Fixed.
- `lib/chat-mock.ts`: the keywords `BETALSIDAN` and `BETALSATT` are told apart by substring only; fine while the words differ. Left as is.

## Outside the change

- `lib/agent-page.ts:36`: the `steps` record has no `payment` entry (the step comes from `last === "betala"`). A backlog candidate, not added to the board: small and unrelated.
