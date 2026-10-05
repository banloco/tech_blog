import { ImageResponse } from "next/og";
import { SITE } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };

/** The picture shown when a page is shared (WhatsApp, Facebook, LinkedIn, X…):
 *  the brand, a colored theme label and the title, big enough to read on a phone. */
export function ogImage({ title, label, color = "#0E7A4B" }: { title: string; label?: string; color?: string }) {
  const size = title.length > 70 ? 56 : title.length > 45 ? 66 : 76;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#FAF7F2", borderTop: "14px solid #0E7A4B", borderBottom: "14px solid #F2B705" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 16, background: "#0E7A4B", color: "#fff", fontSize: 40, fontWeight: 800 }}>B</div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 800, color: "#1C1917" }}>
            Le Plan&nbsp;<span style={{ color: "#0E7A4B" }}>B</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {label && (
            <div style={{ display: "flex", alignSelf: "flex-start", padding: "8px 20px", borderRadius: 999, background: `${color}1A`, color, fontSize: 28, fontWeight: 700 }}>{label}</div>
          )}
          <div style={{ display: "flex", fontSize: size, fontWeight: 800, lineHeight: 1.1, color: "#1C1917", letterSpacing: -1 }}>{title}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#57534E" }}>{SITE.tagline}</div>
      </div>
    ),
    OG_SIZE,
  );
}
