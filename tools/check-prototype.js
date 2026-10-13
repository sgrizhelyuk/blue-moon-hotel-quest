const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js", "app.js"), "utf8");
const story = fs.readFileSync(path.join(root, "js", "story.js"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");

const ids = [];
for (const m of app.matchAll(/\$\("([^"]+)"\)/g)) ids.push(m[1]);
const missingIds = ids.filter(function (id) { return !new RegExp('id="' + id + '"').test(html); });

const refs = new Set();
for (const text of [html, story, css, app]) {
  for (const m of text.matchAll(/assets\/[\w.\-]+\.png/g)) refs.add(m[0]);
}
const missingAssets = [];
refs.forEach(function (p) {
  if (!fs.existsSync(path.join(root, p))) missingAssets.push(p);
});

console.log("IDs checked:", ids.length, "| missing:", missingIds.length ? missingIds : "none");
console.log("Assets referenced:", refs.size, "| missing:", missingAssets.length ? missingAssets : "none");

const scenes = (story.match(/id: "ch\d"|id: "prologue"|id: "epilogue"/g) || []).length;
console.log("Scenes found in story.js:", scenes);

process.exit(missingIds.length || missingAssets.length || scenes !== 10 ? 1 : 0);
