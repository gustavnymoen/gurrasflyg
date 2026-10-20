// Downloads the browser that Playwright uses for tests.
// Skipped on Vercel's build servers, which don't run the tests.
import { execSync } from 'node:child_process';

if (!process.env.VERCEL && !process.env.CI) {
  execSync('npx playwright install chromium', { stdio: 'inherit' });
}
