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
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
      <button
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-1.5 sm:p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {visiblePages.map((page, i) => {
        if (page === '...') {
          return (
            <span key={`dots-${i}`} className="px-2 text-zinc-600">
              ...
            </span>
          );
        }
        
        return (
          <button
            key={page}
            onClick={() => router.push(createPageURL(page))}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-emerald-500 text-white"
                : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => router.push(createPageURL(currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="p-1.5 sm:p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
}
