// Export an Archify diagram the same way the viewer's Export menu does, headlessly, in the light theme.
// See the Diagrams section of docs/contributing/markdown-and-mdx.md.
// Usage: node scripts/archify-export.mjs <diagram.html> <out.webp|out.png|out.svg>
// A .webp output is the viewer's 4x PNG converted with cwebp at half its width, so cwebp must be on PATH.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [htmlArg, outArg] = process.argv.slice(2);
const formats = { ".webp": "png", ".png": "png", ".svg": "svg-light" };
const format = formats[extname(outArg || "").toLowerCase()];
if (!htmlArg || !format) {
  console.error("usage: archify-export.mjs <diagram.html> <out.webp|out.png|out.svg>");
  process.exit(2);
}
const MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME = process.env.CHROME_PATH || (existsSync(MAC_CHROME) ? MAC_CHROME : "google-chrome");
const profile = mkdtempSync(join(tmpdir(), "archify-export-"));
const url = `${pathToFileURL(resolve(htmlArg)).href}?theme=light`;

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    "--remote-debugging-port=0",
    "--window-size=1600,1200",
    "about:blank",
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

const wsUrl = await new Promise((ok, fail) => {
  let buf = "";
  const timer = setTimeout(() => fail(new Error("Chrome did not expose DevTools in time")), 15000);
  chrome.stderr.on("data", (d) => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) {
      clearTimeout(timer);
      ok(m[1]);
    }
  });
  chrome.on("exit", (code) => fail(new Error(`Chrome exited early (${code})`)));
});

const browser = new WebSocket(wsUrl);
await new Promise((ok) => browser.addEventListener("open", ok, { once: true }));
let nextId = 0;
const pending = new Map();
browser.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}, sessionId) =>
  new Promise((ok) => {
    const id = ++nextId;
    pending.set(id, ok);
    browser.send(JSON.stringify({ id, method, params, sessionId }));
  });

try {
  const {
    result: { targetId },
  } = await send("Target.createTarget", { url: "about:blank" });
  const {
    result: { sessionId },
  } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  await send("Page.navigate", { url }, sessionId);

  // Wait for the viewer runtime, then capture the blob the export's synthetic download click carries.
  const expression = `(async () => {
    for (let i = 0; i < 200 && !(window.Archify && Archify.exportMenu); i++) await new Promise(r => setTimeout(r, 50));
    if (!(window.Archify && Archify.exportMenu)) throw new Error('Archify viewer runtime not found');
    await document.fonts.ready;
    const captured = new Promise((ok) => {
      const orig = HTMLAnchorElement.prototype.click;
      HTMLAnchorElement.prototype.click = function () {
        if (this.download) { HTMLAnchorElement.prototype.click = orig; ok({ href: this.href, name: this.download }); }
        else orig.call(this);
      };
    });
    await Archify.exportMenu.run(${JSON.stringify(format)});
    const { href, name } = await captured;
    const bytes = new Uint8Array(await (await fetch(href)).arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return JSON.stringify({ name, theme: document.documentElement.getAttribute('data-theme'), b64: btoa(bin) });
  })()`;
  const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (res.result.exceptionDetails)
    throw new Error(res.result.exceptionDetails.exception?.description || "export failed");
  const { name, theme: rendered, b64 } = JSON.parse(res.result.result.value);
  const bytes = Buffer.from(b64, "base64");
  if (extname(outArg).toLowerCase() === ".webp") {
    const png = join(profile, "export.png");
    writeFileSync(png, bytes);
    // A PNG's width is the big-endian uint32 at byte 16 of its IHDR chunk.
    const width = readFileSync(png).readUInt32BE(16);
    execFileSync("cwebp", ["-quiet", "-q", "90", "-resize", String(Math.round(width / 2)), "0", png, "-o", outArg]);
  } else {
    writeFileSync(outArg, bytes);
  }
  console.log(`exported ${name} (theme=${rendered}) -> ${outArg}`);
} finally {
  browser.close();
  const exited = new Promise((ok) => chrome.once("exit", ok));
  chrome.kill();
  await exited;
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
