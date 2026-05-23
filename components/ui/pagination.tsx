import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) {
    pages.push("ellipsis");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  pages.push(total);
  return pages;
}

function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages = getPageRange(current, total);

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6">
      <button
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm transition-colors duration-100",
          current <= 1
            ? "cursor-not-allowed opacity-30"
            : "cursor-pointer text-muted-foreground hover:bg-muted"
        )}
        onClick={() => current > 1 && onChange(current - 1)}
        disabled={current <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors duration-100",
              page === current
                ? "bg-accent text-accent-foreground font-medium"
                : "cursor-pointer border border-border text-muted-foreground hover:bg-muted"
            )}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm transition-colors duration-100",
          current >= total
            ? "cursor-not-allowed opacity-30"
            : "cursor-pointer text-muted-foreground hover:bg-muted"
        )}
        onClick={() => current < total && onChange(current + 1)}
        disabled={current >= total}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

export { Pagination };
