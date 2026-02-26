"use client";

import { Share2, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard access denied */
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs mr-1 hidden sm:inline" style={{ color: "#555" }}>
        <Share2 className="w-3.5 h-3.5 inline mr-1" />
        Partager
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 transition-colors"
        style={{ background: "#1a1a1a", color: "#888", border: "1px solid #333" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8e8"; e.currentTarget.style.borderColor = "#555"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
        aria-label="Partager sur Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 transition-colors"
        style={{ background: "#1a1a1a", color: "#888", border: "1px solid #333" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#e8e8e8"; e.currentTarget.style.borderColor = "#555"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; }}
        aria-label="Partager sur LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>
      <button
        onClick={copyLink}
        className="p-2 transition-colors"
        style={{ background: "#1a1a1a", color: copied ? "#00E5FF" : "#888", border: `1px solid ${copied ? "rgba(0,229,255,0.4)" : "#333"}` }}
        onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.color = "#e8e8e8"; e.currentTarget.style.borderColor = "#555"; } }}
        onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#333"; } }}
        aria-label="Copier le lien"
      >
        {copied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Link2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
