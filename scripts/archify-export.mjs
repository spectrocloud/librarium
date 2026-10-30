// Export an Archify diagram headlessly, without the title and frame the viewer's image export adds.
// See the Diagrams section of docs/contributing/markdown-and-mdx.md.
// Usage: node scripts/archify-export.mjs <diagram.html> <out.webp|out.png|out.svg> [light|dark]
// The viewer's SVG export is the bare diagram. A raster output is that SVG drawn at twice its size on a white
// background, and a .webp output is then converted with cwebp, so cwebp must be on PATH.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [htmlArg, outArg, theme = "light"] = process.argv.slice(2);
const SCALE = 2;
// The docs site's page backgrounds, --ifm-background-color in src/css/light-mode.scss and src/css/dark-mode.scss.
const PAGE_BG = { light: "#faf9f8", dark: "#000f0f" }[theme];
// Archify's text sizes are fixed for its own viewer (component names 11, sub-labels 9, connection labels 8), which is
// too small once the docs site scales a diagram down to the page column. These are the sizes the docs image uses.
const SIZES = { label: 12.5, sublabel: 11, edge: 10.5, stroke: 2 };

// Runs in the browser on the exported SVG. Enlarges the text and arrows, re-measures each connection label's pill around
// its center, and reports any label that no longer fits its component or that overlaps a component.
function enlarge(svgText, sizes) {
  const holder = document.createElement("div");
  holder.innerHTML = svgText.replace(/^<\?xml[^>]*>/, "");
  document.body.appendChild(holder);
  const svg = holder.querySelector("svg");
  const warnings = [];
  for (const path of svg.querySelectorAll("path[data-edge-from]")) path.setAttribute("stroke-width", sizes.stroke);
  const pills = [];
  for (const g of svg.querySelectorAll("g[data-edge-label]")) {
    const rect = g.querySelector("rect.c-mask");
    const text = g.querySelector("text");
    if (!rect || !text) continue;
    const cx = +rect.getAttribute("x") + +rect.getAttribute("width") / 2;
    const cy = +rect.getAttribute("y") + +rect.getAttribute("height") / 2;
    text.setAttribute("font-size", sizes.edge);
    const w = text.getComputedTextLength() + 10;
    const h = sizes.edge + 6;
    rect.setAttribute("x", cx - w / 2);
    rect.setAttribute("y", cy - h / 2);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    text.setAttribute("y", cy + sizes.edge * 0.35);
    pills.push({ name: g.getAttribute("data-edge-label"), x: cx - w / 2, y: cy - h / 2, w, h });
  }
  const boxes = [];
  for (const g of svg.querySelectorAll("g[data-node-id]")) {
    const box = g.querySelector("rect.c-mask");
    const label = g.querySelector("text[data-node-label]");
    if (!box || !label) continue;
    const x = +box.getAttribute("x"),
      y = +box.getAttribute("y");
    const w = +box.getAttribute("width"),
      h = +box.getAttribute("height");
    boxes.push({ name: g.getAttribute("data-node-id"), x, y, w, h });
    const sub =
      label.nextElementSibling && label.nextElementSibling.tagName === "text" ? label.nextElementSibling : null;
    label.setAttribute("font-size", sizes.label);
    if (sub) {
      sub.setAttribute("font-size", sizes.sublabel);
      label.setAttribute("y", y + h / 2 - 2);
      sub.setAttribute("y", y + h / 2 + sizes.sublabel + 5);
    } else {
      label.setAttribute("y", y + h / 2 + sizes.label * 0.35);
    }
    for (const text of [label, sub].filter(Boolean)) {
      if (text.getComputedTextLength() > w - 12)
        warnings.push(`text "${text.textContent}" overflows component ${g.getAttribute("data-node-id")}`);
    }
  }
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  for (const p of pills)
    for (const b of boxes) if (hit(p, b)) warnings.push(`label "${p.name}" overlaps component ${b.name}`);
  for (let i = 0; i < pills.length; i++)
    for (let j = i + 1; j < pills.length; j++)
      if (hit(pills[i], pills[j])) warnings.push(`labels "${pills[i].name}" and "${pills[j].name}" overlap`);
  const out = new XMLSerializer().serializeToString(svg);
  holder.remove();
  return { svgText: out, warnings };
}
const ext = extname(outArg || "").toLowerCase();
if (!htmlArg || ![".webp", ".png", ".svg"].includes(ext) || !PAGE_BG) {
  console.error("usage: archify-export.mjs <diagram.html> <out.webp|out.png|out.svg> [light|dark]");
  process.exit(2);
}
const MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME = process.env.CHROME_PATH || (existsSync(MAC_CHROME) ? MAC_CHROME : "google-chrome");
const profile = mkdtempSync(join(tmpdir(), "archify-export-"));
const url = `${pathToFileURL(resolve(htmlArg)).href}?theme=${theme}`;

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

  // Wait for the viewer runtime, capture the SVG blob the export's synthetic download click carries, and, for a
  // raster output, draw that SVG onto a canvas.
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
    await Archify.exportMenu.run('svg-${theme}');
    const { href, name } = await captured;
    // Paint the canvas in the docs site's light-mode page color and drop the dot grid, so the diagram sits on the page
    // without a visible box around it.
    const exported = (await (await fetch(href)).text())
      .replace(/(<rect x="0" y="0" width="[0-9.]+" height="[0-9.]+" fill=")#[0-9a-fA-F]{6}("\\/>)/, '$1${PAGE_BG}$2')
      .replace('<rect width="100%" height="100%" fill="url(#grid)"/>', '');
    const { svgText, warnings } = (${enlarge.toString()})(exported, ${JSON.stringify(SIZES)});
    let blob = new Blob([svgText], { type: 'image/svg+xml' });
    if (${JSON.stringify(ext !== ".svg")}) {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * ${SCALE});
      canvas.height = Math.round(img.naturalHeight * ${SCALE});
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '${PAGE_BG}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((ok) => canvas.toBlob(ok, 'image/png'));
    }
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return JSON.stringify({ name, warnings, theme: document.documentElement.getAttribute('data-theme'), b64: btoa(bin) });
  })()`;
  const res = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (res.result.exceptionDetails)
    throw new Error(res.result.exceptionDetails.exception?.description || "export failed");
  const { name, warnings, theme: rendered, b64 } = JSON.parse(res.result.result.value);
  for (const warning of warnings) console.warn(`warning: ${warning}`);
  const bytes = Buffer.from(b64, "base64");
  if (ext === ".webp") {
    const png = join(profile, "export.png");
    writeFileSync(png, bytes);
    execFileSync("cwebp", ["-quiet", "-q", "90", png, "-o", outArg]);
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
