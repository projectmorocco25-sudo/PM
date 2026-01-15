"use client";

import { useEffect, useRef, useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
  filters,
  className,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && ref.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-9 text-sm text-zinc-900 outline-none ring-blue-500 focus:ring-2"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-500 hover:bg-zinc-100"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {filters ? (
        <div className="relative">
          <button
            type="button"
            aria-label="Filters"
            aria-expanded={open}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800 hover:bg-zinc-50"
            onClick={() => setOpen((v) => !v)}
          >
            <Filter className="h-4 w-4 text-zinc-500" aria-hidden="true" />
            Filters
          </button>
          {open ? (
            <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-md border border-zinc-200 bg-white p-3 shadow-lg">
              {filters}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

