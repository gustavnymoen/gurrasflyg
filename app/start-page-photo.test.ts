import { statSync } from "node:fs";
import { expect, test } from "vitest";

test("TRIP-020-R3 the photo file is at most 300 kB and in public/brand", async () => {
  expect(statSync("public/brand/skymning.jpg").size).toBeLessThanOrEqual(300 * 1024);
});
