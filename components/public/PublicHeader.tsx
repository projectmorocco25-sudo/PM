"use client";

/**
 * Wireframe: task-0.5.1.1-public-homepage.md
 * Public header: MOH logo, About, Support, Status, Login, Register.
 * Sticky, white bg, border-bottom. Mobile: hamburger + drawer.
 */

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Status", href: "/status" },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white py-4 px-6">
      <div className="mx-auto flex max-w-[1920px] items-center justify-between">
        <Link href="/" className="shrink-0 text-xl font-bold text-[#111827]" aria-label="MOH – Home">
          MOH
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6" aria-label="Main navigation">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[#4b5563] hover:text-[#111827] hover:underline"
            >
              {label}
            </Link>
          ))}
          <div className="ml-4 flex gap-3">
            <Link
              href="/login"
              className="text-[#4b5563] hover:text-[#111827] hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white hover:bg-[#2563eb]"
            >
              Register
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-[#4b5563] hover:bg-[#f3f4f6] md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-[min(320px,85vw)] flex-col border-l border-[#e5e7eb] bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] p-4">
              <span className="font-semibold text-[#111827]">Menu</span>
              <button
                type="button"
                className="rounded-md p-2 text-[#4b5563] hover:bg-[#f3f4f6]"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
              {NAV.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-4 py-3 text-[#4b5563] hover:bg-[#f9fafb] hover:text-[#111827]"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t border-[#e5e7eb] pt-4">
                <Link
                  href="/login"
                  className="rounded-md px-4 py-3 text-center text-[#4b5563] hover:bg-[#f9fafb] hover:text-[#111827]"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-[#3b82f6] px-4 py-3 text-center font-medium text-white hover:bg-[#2563eb]"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
