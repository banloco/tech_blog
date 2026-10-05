"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}#articles`;
  };

  if (totalPages <= 1) return null;

  // Calculate visible page numbers for mobile
  const getVisiblePages = () => {
    const delta = 1; // Pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10 sm:mt-14">
      <button
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2 border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--text-muted)" }}
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {visiblePages.map((page, i) => {
        if (page === '...') {
          return (
            <span key={`dots-${i}`} className="px-2 text-xs" style={{ color: "var(--line-strong)" }}>
              ···
            </span>
          );
        }
        const isActive = currentPage === page;
        return (
          <button
            key={page}
            onClick={() => router.push(createPageURL(page))}
            className="w-8 h-8 text-xs font-medium border transition-colors"
            style={{
              borderColor: isActive ? "var(--brand)" : "var(--line)",
              background: isActive ? "color-mix(in srgb, var(--brand) 8%, transparent)" : "var(--surface)",
              color: isActive ? "var(--brand)" : "var(--text-muted)",
            }}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-2 border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--text-muted)" }}
        aria-label="Page suivante"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
