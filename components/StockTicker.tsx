"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Simulated live data — replace with real API if needed
const BASE_DATA: TickerItem[] = [
  { symbol: "NVDA",  price: 875.40, change: +12.30, changePercent: +1.43 },
  { symbol: "MSFT",  price: 415.20, change: -3.50,  changePercent: -0.84 },
  { symbol: "GOOGL", price: 173.85, change: +2.10,  changePercent: +1.22 },
  { symbol: "META",  price: 508.60, change: +6.70,  changePercent: +1.33 },
  { symbol: "AMZN",  price: 192.30, change: -1.20,  changePercent: -0.62 },
  { symbol: "TSLA",  price: 248.90, change: +8.45,  changePercent: +3.51 },
  { symbol: "OPENAI-SEED", price: 0, change: 0, changePercent: 0 }, // placeholder for AI funding
];

// Funding rounds news items
const FUNDING_ITEMS = [
  "Anthropic · $750M Series E",
  "Mistral AI · €600M Series B",
  "Perplexity · $500M Series D",
  "xAI · $6B Série B",
  "Cohere · $270M Series D",
];

function useSimulatedPrices(base: TickerItem[]): TickerItem[] {
  const [data, setData] = useState<TickerItem[]>(base.filter(d => d.symbol !== "OPENAI-SEED"));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev =>
        prev.map(item => {
          const drift = (Math.random() - 0.49) * 0.5;
          const newPrice = parseFloat((item.price + drift).toFixed(2));
          const newChange = parseFloat((item.change + drift).toFixed(2));
          const newPct = parseFloat(((newChange / item.price) * 100).toFixed(2));
          return { ...item, price: newPrice, change: newChange, changePercent: newPct };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

export default function StockTicker() {
  const stocks = useSimulatedPrices(BASE_DATA);

  const allItems = [
    ...stocks.map((s, i) => ({ type: "stock" as const, data: s, key: `s-${s.symbol}-${i}` })),
    ...FUNDING_ITEMS.map((f, i) => ({ type: "fund" as const, label: f, key: `f-${i}` })),
  ];

  // Duplicate for seamless infinite scroll
  const doubled = [...allItems, ...allItems.map(item => ({ ...item, key: `dup-${item.key}` }))];

  return (
    <div
      className="w-full overflow-hidden border-b"
      style={{
        background: "#0e0e0e",
        borderColor: "#2a2a2a",
        height: "28px",
      }}
      aria-hidden="true"
    >
      <div
        className="ticker-track flex items-center gap-6 whitespace-nowrap h-full"
        style={{ width: "max-content" }}
      >
        {doubled.map((item) =>
          item.type === "stock" ? (
            <span
              key={item.key}
              className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide"
              style={{ fontFamily: "'Inter', monospace" }}
            >
              <span style={{ color: "#888" }} className="text-[10px]">
                {item.data.symbol}
              </span>
              <span style={{ color: "#e8e8e8" }}>
                ${item.data.price.toFixed(2)}
              </span>
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{
                  color: item.data.change >= 0 ? "#00E5FF" : "#ff5555",
                }}
              >
                {item.data.change >= 0 ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {item.data.change >= 0 ? "+" : ""}
                {item.data.changePercent.toFixed(2)}%
              </span>
              <span style={{ color: "#333", marginLeft: "4px" }}>|</span>
            </span>
          ) : (
            <span
              key={item.key}
              className="flex items-center gap-2 text-[10px] tracking-widest uppercase"
              style={{ color: "#C19A6B", fontFamily: "'Inter', monospace" }}
            >
              <span
                className="inline-block w-1 h-1"
                style={{ background: "#C19A6B" }}
              />
              {item.label}
              <span style={{ color: "#333", marginLeft: "4px" }}>|</span>
            </span>
          )
        )}
      </div>
    </div>
  );
}
