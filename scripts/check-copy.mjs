// Fails if any copy file contains an em dash or en dash. House rule.
import fs from "node:fs";
import path from "node:path";
const roots = ["content", "app", "components"];
const bad = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) return walk(p);
  if (!/\.(md|ts|tsx)$/.test(e.name)) return;
  fs.readFileSync(p, "utf8").split("\n").forEach((l, i) => { if (/[–—]/.test(l)) bad.push(`${p}:${i + 1}: ${l.trim().slice(0, 100)}`); });
});
roots.forEach(walk);
if (bad.length) { console.error("Dashes found:\n" + bad.join("\n")); process.exit(1); }
console.log("Copy check passed: no em or en dashes.");
