"use client";

import { TrendingUp } from "lucide-react";

// AI economy market cap data (in $B) — illustrative
const DATA_POINTS = [42, 58, 71, 89, 95, 112, 130, 158, 180, 210, 245, 290];
const LABELS     = ["Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév"];

const W = 260;
const H = 80;
const PADDING = { top: 8, right: 8, bottom: 20, left: 28 };

const minVal = Math.min(...DATA_POINTS);
const maxVal = Math.max(...DATA_POINTS);

function toX(i: number) {
  return PADDING.left + (i / (DATA_POINTS.length - 1)) * (W - PADDING.left - PADDING.right);
}
function toY(v: number) {
  return PADDING.top + (1 - (v - minVal) / (maxVal - minVal)) * (H - PADDING.top - PADDING.bottom);
}

const polyline = DATA_POINTS.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
const areaPath = `M${toX(0)},${toY(DATA_POINTS[0])} ` +
  DATA_POINTS.map((v, i) => `L${toX(i)},${toY(v)}`).join(" ") +
  ` L${toX(DATA_POINTS.length - 1)},${H - PADDING.bottom} L${toX(0)},${H - PADDING.bottom} Z`;

const lastX = toX(DATA_POINTS.length - 1);
const lastY = toY(DATA_POINTS[DATA_POINTS.length - 1]);

export default function MarketPulse() {
  const growth = (((DATA_POINTS[DATA_POINTS.length - 1] - DATA_POINTS[0]) / DATA_POINTS[0]) * 100).toFixed(0);

  return (
    <div
      className="p-4"
      style={{ background: "#1a1a1a", border: "1px solid #333" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3
          className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "#888", letterSpacing: "0.14em" }}
        >
          <TrendingUp className="w-3 h-3" style={{ color: "#00E5FF" }} />
          Market Pulse
        </h3>
        <span
          className="text-[9px] px-1.5 py-0.5 border font-medium"
          style={{ color: "#00E5FF", borderColor: "rgba(0,229,255,0.3)", letterSpacing: "0.06em" }}
        >
          IA ECONOMY
        </span>
      </div>

      {/* Value */}
      <div className="mb-3">
        <span
          className="text-xl font-bold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8e8e8" }}
        >
          ${DATA_POINTS[DATA_POINTS.length - 1]}B
        </span>
        <span
          className="ml-2 text-[10px] font-medium"
          style={{ color: "#00E5FF" }}
        >
          +{growth}% <span style={{ color: "#555" }}>12 mois</span>
        </span>
      </div>

      {/* Sparkline chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#00E5FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75].map((frac, i) => {
          const y = PADDING.top + frac * (H - PADDING.top - PADDING.bottom);
          const val = Math.round(maxVal - frac * (maxVal - minVal));
          return (
            <g key={i}>
              <line x1={PADDING.left} y1={y} x2={W - PADDING.right} y2={y} stroke="#2a2a2a" strokeWidth="0.5" />
              <text x={PADDING.left - 4} y={y + 3} textAnchor="end" fontSize="6" fill="#444">{val}</text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#00E5FF"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Last point dot */}
        <circle cx={lastX} cy={lastY} r="2.5" fill="#00E5FF" />
        <circle cx={lastX} cy={lastY} r="5" fill="none" stroke="#00E5FF" strokeWidth="0.5" opacity="0.5" className="pulse-line" />

        {/* X-axis labels — every 3 ticks */}
        {LABELS.map((label, i) => {
          if (i % 3 !== 0) return null;
          return (
            <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="6" fill="#444">
              {label}
            </text>
          );
        })}
      </svg>

      {/* Caption */}
      <p className="mt-2 text-[9px]" style={{ color: "#444", letterSpacing: "0.06em" }}>
        Capitalisation AI Economy mondiale · Source estimée
      </p>
    </div>
  );
}
