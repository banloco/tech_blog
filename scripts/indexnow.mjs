/**
 * Tells Bing, Yandex, Seznam… (and, through Bing, DuckDuckGo, Yahoo and Copilot) that pages are new
 * or changed, so they are crawled within minutes instead of days. Run it after publishing.
 *
 *   node scripts/indexnow.mjs                 # every page of the live sitemap
 *   node scripts/indexnow.mjs /posts/my-slug  # only these pages
 *
 * The key is public by design: the engines check it at https://<site>/<key>.txt (public/).
 */
const SITE = "https://planb.danxolabs.com";
const KEY = "2496cfd5bc59db450b9687961a4ba211";

let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : SITE + (p.startsWith("/") ? p : "/" + p)));
if (urls.length === 0) {
  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE));
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted (key check pending)
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} page(s)`);
if (!res.ok) {
  console.log(await res.text());
  process.exit(1);
}
