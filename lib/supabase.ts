import { createClient } from "@supabase/supabase-js";

// Timeout for Supabase fetch calls (5s instead of the default 10s).
// Prevents SSR pages from hanging on cold starts or slow connections.
const FETCH_TIMEOUT_MS = 5000;

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

export default createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: { fetch: fetchWithTimeout },
  }
);