"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollTop}
      aria-label="Retour en haut"
      className={`fixed bottom-6 right-6 z-40 p-2.5 transition-all duration-300 border ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ background: "#1a1a1a", borderColor: "#333", color: "#888" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#00E5FF"; (e.currentTarget as HTMLElement).style.color = "#00E5FF"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#333"; (e.currentTarget as HTMLElement).style.color = "#888"; }}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
