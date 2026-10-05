import Link from "next/link";
import { SITE } from "@/lib/site";

/** The wordmark: a green "B" tile with a yellow corner, then the name. */
export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label={`${SITE.name}, accueil`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl font-display text-xl font-extrabold text-white" style={{ background: "var(--brand)" }} aria-hidden="true">
        B
        <span className="absolute right-0 top-0 h-3 w-3 rounded-bl-lg" style={{ background: "var(--sun)" }} />
      </span>
      <span className="font-display text-xl font-extrabold leading-none tracking-tight" style={{ color: "var(--ink)" }}>
        Le Plan <span style={{ color: "var(--brand)" }}>B</span>
      </span>
    </Link>
  );
}
