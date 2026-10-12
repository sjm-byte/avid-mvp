// Used by .github/workflows/preview.yml: takes full-page screenshots of key pages.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const base = "http://127.0.0.1:3000";
const pages = (process.env.SHOT_PAGES ||
  "/,/transparency,/projects,/about,/faq,/contact,/en,/en/transparency,/en/transparency?section=methodology,/en/transparency?section=contracts,/en/projects,/en/projects/p015,/en/about,/en/faq,/en/contact")
  .split(",");
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

mkdirSync("ci-out/shots", { recursive: true });
const report = [];
const browser = await chromium.launch();
for (const [vpName, vp] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: vpName === "mobile" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  for (const p of pages) {
    errors.length = 0;
    const res = await page.goto(base + p, { waitUntil: "networkidle" }).catch((e) => ({ status: () => String(e) }));
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const name = `${vpName}${p.replace(/[/?=&]+/g, "_") || "_home"}`;
    await page.screenshot({ path: `ci-out/shots/${name}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    report.push({ vp: vpName, path: p, status: res.status(), overflowPx: overflow, errors: [...errors] });
  }
  await ctx.close();
}
await browser.close();
writeFileSync("ci-out/report.json", JSON.stringify(report, null, 2));
