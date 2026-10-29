// Builds a three.js typeface JSON (only the glyphs we need) from Bricolage Grotesque 800.
import opentype from "opentype.js";
import fs from "node:fs";
const src = "node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff";
const font = opentype.parse(fs.readFileSync(src).buffer.slice(0));
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-!&' ";
const scale = (1000 * 100) / ((font.unitsPerEm || 2048) * 72);
const glyphs = {};
for (const ch of chars) {
  const g = font.charToGlyph(ch);
  const token = { ha: Math.round(g.advanceWidth * scale), x_min: 0, x_max: 0, o: "" };
  const b = g.getBoundingBox();
  token.x_min = Math.round(b.x1 * scale); token.x_max = Math.round(b.x2 * scale);
  g.path.commands.forEach((c) => {
    const t = c.type.toLowerCase() === "c" ? "b" : c.type.toLowerCase();
    token.o += t + " ";
    if (c.x !== undefined && c.y !== undefined) token.o += Math.round(c.x * scale) + " " + Math.round(c.y * scale) + " ";
    if (c.x1 !== undefined) token.o += Math.round(c.x1 * scale) + " " + Math.round(c.y1 * scale) + " ";
    if (c.x2 !== undefined) token.o += Math.round(c.x2 * scale) + " " + Math.round(c.y2 * scale) + " ";
  });
  glyphs[ch] = token;
}
const out = {
  glyphs, familyName: "Bricolage Grotesque", ascender: Math.round(font.ascender * scale),
  descender: Math.round(font.descender * scale), underlinePosition: 0, underlineThickness: 0,
  boundingBox: { yMin: Math.round(font.tables.head.yMin * scale), xMin: Math.round(font.tables.head.xMin * scale), yMax: Math.round(font.tables.head.yMax * scale), xMax: Math.round(font.tables.head.xMax * scale) },
  resolution: 1000, original_font_information: { format: 0, fontFamily: "Bricolage Grotesque", fontSubfamily: "ExtraBold" }, cssFontWeight: "bold", cssFontStyle: "normal",
};
fs.writeFileSync("public/fonts/bricolage-800.typeface.json", JSON.stringify(out));
console.log("glyphs", Object.keys(glyphs).length, "bytes", fs.statSync("public/fonts/bricolage-800.typeface.json").size);
