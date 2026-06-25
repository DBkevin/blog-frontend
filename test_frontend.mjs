import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.waitForSelector(".hero-title", { timeout: 5000 });

console.log("Test1 Unicode escapes:", await page.evaluate(() => document.body.textContent.includes("\\u")));

console.log("Test2 Hero title:", await page.textContent(".hero-title"));

const sb = await page.textContent(".sidebar");
console.log("Test3 Recent:", sb.includes("最近更新"));
console.log("Test3 Categories:", sb.includes("分类"));
console.log("Test3 Tags:", sb.includes("标签"));
console.log("Test3 Subscribe:", sb.includes("订阅"));

const cards = await page.evaluate(() => document.querySelectorAll(".article-card").length);
console.log("Test4 Cards:", cards);

if (cards > 0) {
  const firstTitle = await page.evaluate(() => document.querySelector(".article-card h2 a")?.textContent);
  console.log("Test5 First article:", firstTitle);

  await page.evaluate(() => document.querySelector(".article-card h2 a")?.click());
  await page.waitForTimeout(2000);

  try {
    await page.waitForSelector(".post-title", { timeout: 5000 });
    const t1 = await page.textContent(".post-title");
    console.log("Test6 Detail title:", t1);

    const navCount = await page.evaluate(() => document.querySelectorAll(".nav-item a").length);
    console.log("Test7 Nav links:", navCount);

    if (navCount > 0) {
      const navInfo = await page.evaluate(() => {
        const link = document.querySelector(".nav-item a");
        return { text: link?.textContent, href: link?.getAttribute("href") };
      });
      console.log("Test8 Nav:", navInfo.text, "(" + navInfo.href + ")");

      // Click first nav link
      await page.evaluate(() => document.querySelector(".nav-item a")?.click());
      await page.waitForTimeout(2000);

      const t2 = await page.textContent(".post-title");
      const url = page.url();
      console.log("Test9 New title:", t2);
      console.log("Test10 URL:", url);
      console.log("Test11 Content changed:", t1 !== t2);
    }
  } catch(e) {
    console.log("FAIL Detail:", e.message);
  }
}

await page.goto("http://localhost:5173/about", { waitUntil: "networkidle" });
console.log("Test12 About:", await page.textContent(".about-title"));

await page.goto("http://localhost:5173/categories/devops", { waitUntil: "networkidle" });
console.log("Test13 Category:", await page.textContent(".list-title"));

await page.goto("http://localhost:5173/nonexistent", { waitUntil: "networkidle" });
console.log("Test14 404 code:", await page.textContent(".nf-code"));

const btns = await page.evaluate(() => document.querySelectorAll(".icon-btn").length);
if (btns > 1) {
  await page.evaluate(() => document.querySelectorAll(".icon-btn")[1].click());
  await page.waitForTimeout(300);
  console.log("Test15 Dark mode:", await page.evaluate(() => document.documentElement.classList.contains("dark")));
}

await browser.close();
console.log("=== ALL TESTS COMPLETED ===");
