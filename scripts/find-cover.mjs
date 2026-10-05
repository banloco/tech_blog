#!/usr/bin/env node
/**
 * Find free cover photos (CC0 licence, no credit required) for an article.
 *
 *   node scripts/find-cover.mjs "budget calculator"
 *
 * Search in English: the photo banks are indexed in English. Prints one candidate per line
 * (url | title); put the chosen url in the article's "cover_image" field.
 * Source: Openverse (api.openverse.org), photos from StockSnap and Rawpixel.
 */
const query = process.argv.slice(2).join(" ").trim();
if (!query) {
  console.error('Usage: node scripts/find-cover.mjs "search words in English"');
  process.exit(1);
}

const params = new URLSearchParams({
  q: query,
  license: "cc0",
  source: "stocksnap,rawpixel",
  aspect_ratio: "wide",
  size: "large",
  page_size: "10",
});
const res = await fetch(`https://api.openverse.org/v1/images/?${params}`);
if (!res.ok) {
  console.error(`Openverse search failed (${res.status})`);
  process.exit(1);
}
const { results } = await res.json();
if (!results.length) console.log("No photo found: try other (simpler) English words.");
for (const p of results) console.log(`${p.url} | ${p.title || "(untitled)"}`);
