#!/usr/bin/env node
/**
 * Send an article to the blog as a DRAFT (never published directly).
 *
 *   node scripts/post-draft.mjs article.json      check the article, then create the draft
 *   node scripts/post-draft.mjs --check article.json   only check, send nothing
 *   node scripts/post-draft.mjs --list            titles already written (drafts included)
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and DRAFT_TOKEN, from the
 * environment or from .env.local. The token is created in Supabase (see
 * supabase/2026-10-05_drafts_automation.sql) and can only create drafts.
 *
 * article.json: { title, slug, category, focus_keyword, excerpt, tags, meta_title, meta_description, cover_image, content }
 * cover_image is the https address of a free photo (see scripts/find-cover.mjs).
 * where content is HTML using only the tags the blog's editor knows (see ALLOWED_TAGS).
 */
import { readFileSync, existsSync } from "node:fs";

const CATEGORIES = ["gagner-de-l-argent", "finances-perso", "productivite", "outils-ia"];
const ALLOWED_TAGS = new Set(["h2", "h3", "p", "ul", "ol", "li", "strong", "em", "a", "blockquote", "code", "pre", "hr", "br", "table", "thead", "tbody", "tr", "th", "td"]);

// Environment: real variables first, then .env.local
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
const { NEXT_PUBLIC_SUPABASE_URL: URL_, NEXT_PUBLIC_SUPABASE_ANON_KEY: KEY, DRAFT_TOKEN: TOKEN } = process.env;

async function rpc(fn, body) {
  if (!URL_ || !KEY || !TOKEN) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY or DRAFT_TOKEN");
  const res = await fetch(`${URL_}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_token: TOKEN, ...body }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${fn} failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

/** Problems that would make the draft unusable. Returns a list of messages (empty = fine). */
function check(a) {
  const problems = [];
  const words = (a.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  if (!a.title || a.title.length > 90) problems.push("title missing or longer than 90 characters");
  if (!a.focus_keyword) problems.push("focus_keyword missing (the main search phrase targeted)");
  if (!CATEGORIES.includes(a.category)) problems.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  if (!a.excerpt || a.excerpt.length > 220) problems.push("excerpt missing or longer than 220 characters");
  if (a.meta_title && a.meta_title.length > 65) problems.push("meta_title longer than 65 characters");
  if (!a.meta_description || a.meta_description.length > 160) problems.push("meta_description missing or longer than 160 characters");
  if (words < 900) problems.push(`content too short (${words} words, at least 900)`);
  for (const [, tag] of (a.content || "").matchAll(/<\/?([a-zA-Z0-9]+)[\s>]/g)) {
    if (!ALLOWED_TAGS.has(tag.toLowerCase())) problems.push(`HTML tag <${tag}> is not supported by the editor`);
  }
  if (/<h1[\s>]/i.test(a.content || "")) problems.push("no <h1> in the content: the title is already the page's h1");
  if (!/Sources/i.test(a.content || "")) problems.push('a "Sources" section with links is required');
  if (!/^https:\/\//.test(a.cover_image || "")) problems.push("cover_image missing: an https photo address (node scripts/find-cover.mjs \"words\")");
  return [...new Set(problems)];
}

/** The cover must really be an image the site can download. */
async function checkCover(url) {
  try {
    const res = await fetch(url);
    if (!res.ok || !(res.headers.get("content-type") || "").startsWith("image/")) return [`cover_image does not lead to an image (${res.status})`];
  } catch {
    return ["cover_image could not be downloaded"];
  }
  return [];
}

const args = process.argv.slice(2);
try {
  if (args[0] === "--list") {
    const rows = await rpc("list_post_titles", {});
    for (const r of rows) console.log(`${r.status.padEnd(9)} ${r.title}`);
    if (!rows.length) console.log("(no articles yet)");
  } else {
    const checkOnly = args[0] === "--check";
    const file = checkOnly ? args[1] : args[0];
    if (!file) throw new Error("Usage: node scripts/post-draft.mjs [--check] article.json | --list");
    const article = JSON.parse(readFileSync(file, "utf8"));
    let problems = check(article);
    if (!problems.length) problems = await checkCover(article.cover_image);
    if (problems.length) {
      console.error("Article not sent:\n- " + problems.join("\n- "));
      process.exit(2);
    }
    if (checkOnly) {
      console.log("OK, the article is valid.");
    } else {
      const slug = await rpc("create_draft", {
        p_title: article.title,
        p_slug: article.slug,
        p_content: article.content,
        p_excerpt: article.excerpt,
        p_category_slug: article.category,
        p_tags: article.tags || [],
        p_meta_title: article.meta_title || null,
        p_meta_description: article.meta_description,
        p_focus_keyword: article.focus_keyword,
        p_cover_image: article.cover_image,
      });
      console.log(`Draft created: ${slug} (publish it from /admin/articles after review)`);
    }
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
