"use client";

import { Link2, Check, Share2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

// Brand logos as small inline SVGs (lucide doesn't ship WhatsApp or Facebook)
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.3c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.3 8.3 0 1 1 12 20.3z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.5c0-.9.3-1.6 1.6-1.6h1.7V4.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V22h3.4z" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M6.9 8.5H3.6V20h3.3V8.5zM5.3 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM20.4 13.4c0-3.1-1.7-4.9-4.3-4.9-1.6 0-2.6.9-3.1 1.6V8.5H9.8V20h3.3v-5.7c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3l.1-6.6z" />
  </svg>
);

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const t = encodeURIComponent(title);
  const u = encodeURIComponent(url);

  // The phone's own share sheet, when available (Android, iPhone). False on the server.
  const canShare = useSyncExternalStore(() => () => {}, () => !!navigator.share, () => false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard access denied */
    }
  }

  const networks = [
    // WhatsApp first: it's how most articles get passed around here
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}`, icon: WhatsAppIcon, color: "#128C7E" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: FacebookIcon, color: "#1877F2" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, icon: XIcon, color: "#1C1917" },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: LinkedInIcon, color: "#0A66C2" },
  ];

  const itemClass = "inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors hover:border-[var(--ink)]";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {networks.map(({ label, href, icon: Icon, color }, i) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Partager sur ${label}`}
          className={itemClass}
          style={i === 0
            ? { background: color, borderColor: color, color: "#fff" }
            : { borderColor: "var(--line-strong)", color, background: "var(--surface)" }}>
          <Icon />
          <span className={i === 0 ? "" : "sr-only sm:not-sr-only"}>{label}</span>
        </a>
      ))}
      <button onClick={copyLink} className={itemClass} aria-label="Copier le lien"
        style={{ borderColor: "var(--line-strong)", color: copied ? "var(--brand)" : "var(--text-muted)", background: "var(--surface)" }}>
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
        <span>{copied ? "Copié !" : "Copier"}</span>
      </button>
      {canShare && (
        <button onClick={() => navigator.share({ title, url }).catch(() => {})} className={itemClass} aria-label="Plus d'options de partage"
          style={{ borderColor: "var(--line-strong)", color: "var(--text-muted)", background: "var(--surface)" }}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
