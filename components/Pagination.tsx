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

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => router.push(createPageURL(currentPage - 1))}
        disabled={currentPage <= 1}
        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Note précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        // Simple logic to show limited page numbers could be added here
        return (
          <button
            key={page}
            onClick={() => router.push(createPageURL(page))}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
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
        className="p-2 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 hover:text-white transition-colors"
        aria-label="Note suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
