"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useApp } from "@/contexts/AppContext";

function initialsFromEmail(email?: string | null) {
  if (!email) return "U";
  const base = email.split("@")[0] ?? "u";
  const parts = base.split(/[._-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? base[0] ?? "u";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

export function UserMenu() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const initials = useMemo(() => initialsFromEmail(user?.email), [user?.email]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const el = ref.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        aria-expanded={open}
        className={clsx(
          "flex items-center gap-2 rounded-md p-1.5 transition-colors",
          "hover:bg-zinc-100 active:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <span className="hidden text-sm text-zinc-700 sm:inline">{user?.email ?? "User"}</span>
        <span className={clsx("text-xs text-zinc-500 transition-transform", open && "rotate-180")}>▼</span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-52 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg">
          <Link className="block rounded px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100" href="/profile">
            👤 Profile
          </Link>
          <Link className="block rounded px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100" href="/settings">
            ⚙️ Settings
          </Link>
          <div className="my-1 border-t border-zinc-200" />
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
          >
            🚪 Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

