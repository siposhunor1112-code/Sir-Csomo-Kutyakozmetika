// Újragyártja a megosztási képet (public/assets/og.jpg) és az iPhone-ikont (public/assets/apple-touch-icon.png).
// Futtatás: node tools/images.js   (Playwright kell hozzá: npm i -D playwright)
const path = require("path");
const fs = require("fs");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "public");
const font = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(ROOT, "assets", "fonts", f)).toString("base64");

const base = `
  @font-face { font-family: PF; font-weight: 400 900; src: url(${font("playfair-display-latin-wght-normal.woff2")}); }
  @font-face { font-family: PF; font-weight: 400 900; src: url(${font("playfair-display-latin-ext-wght-normal.woff2")}); unicode-range: U+0100-02BA; }
  @font-face { font-family: PF; font-style: italic; font-weight: 400 900; src: url(${font("playfair-display-latin-wght-italic.woff2")}); }
  @font-face { font-family: PF; font-style: italic; font-weight: 400 900; src: url(${font("playfair-display-latin-ext-wght-italic.woff2")}); unicode-range: U+0100-02BA; }
  @font-face { font-family: FT; font-weight: 300 900; src: url(${font("figtree-latin-wght-normal.woff2")}); }
  @font-face { font-family: FT; font-weight: 300 900; src: url(${font("figtree-latin-ext-wght-normal.woff2")}); unicode-range: U+0100-02BA; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body { background: #f5f2eb; color: #15171b; font-family: FT; overflow: hidden; position: relative; font-variant-numeric: lining-nums; }
  em { font-family: PF; font-style: italic; font-weight: 400; color: #a8844a; }
`;

const TIE = `<path d="M20.2 20.4C16.6 16 10.8 12.6 5.6 12.2c-1.6-.1-2.6 1-2.6 2.6v18.4c0 1.6 1 2.7 2.6 2.6 5.2-.4 11-3.8 14.6-8.2zM27.8 20.4c3.6-4.4 9.4-7.8 14.6-8.2 1.6-.1 2.6 1 2.6 2.6v18.4c0 1.6-1 2.7-2.6 2.6-5.2-.4-11-3.8-14.6-8.2z"/>`;
const mark = (size, ink = "#15171b") => `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><g fill="${ink}">${TIE}</g><rect x="20.6" y="18.6" width="6.8" height="10.8" rx="2.2" fill="#a8844a"/></svg>`;

const og = `<style>${base}
  .wrap { position: absolute; left: 76px; top: 64px; bottom: 60px; width: 640px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; gap: 16px; }
  .top b { font: 500 34px/1 PF; }
  .top small { display: block; margin-top: 8px; font: 600 12px/1 FT; letter-spacing: .24em; text-transform: uppercase; color: #6f6c66; }
  h1 { margin-top: auto; font: 400 108px/.94 PF; letter-spacing: -.035em; }
  .bottom { margin-top: 36px; padding-top: 22px; border-top: 1px solid rgba(21,23,27,.14); display: flex; gap: 36px; font: 500 19px/1 FT; color: #6f6c66; }
  .bottom b { color: #15171b; font-weight: 600; }
  .plate { position: absolute; right: 64px; top: 64px; bottom: 64px; width: 380px; background: #fbf9f5; border: 1px solid rgba(21,23,27,.12);
    box-shadow: 0 40px 70px -46px rgba(40,32,18,.5); display: grid; place-items: center; }
  .plate::before { content: ""; position: absolute; inset: 12px; border: 1px solid rgba(21,23,27,.1); }
  .plate span { position: absolute; width: 10px; height: 10px; border: 1px solid #a8844a; }
  .plate .a { top: 8px; left: 8px; border-right: 0; border-bottom: 0; } .plate .b { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
  .plate .c { bottom: 8px; left: 8px; border-right: 0; border-top: 0; } .plate .d { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }
</style>
<div class="wrap">
  <div class="top">${mark(52)}<div><b>Sir <em>Csomó</em></b><small>Kutyakozmetika · Zugló</small></div></div>
  <h1>Csomóból<br><em>úriember.</em></h1>
  <div class="bottom"><span>Erzsébet királyné útja 70/A</span><span><b>+36 70 785 8888</b></span></div>
</div>
<div class="plate"><span class="a"></span><span class="b"></span><span class="c"></span><span class="d"></span>${mark(290)}</div>`;

const icon = `<style>${base} body { display: grid; place-items: center; }</style>${mark(132)}`;

(async () => {
  const browser = await chromium.launch();
  const shot = async (html, w, h, file, type) => {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(ROOT, "assets", file), type, ...(type === "jpeg" ? { quality: 88 } : {}) });
    await page.close();
    console.log("kész:", file);
  };
  await shot(og, 1200, 630, "og.jpg", "jpeg");
  await shot(icon, 180, 180, "apple-touch-icon.png", "png");
  await browser.close();
})();
