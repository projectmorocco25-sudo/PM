/**
 * Wireframe: N/A (Public Layout)
 * Route: All public pages (/)
 * Implements: Public layout with header navigation and footer.
 * Wireframe Link: N/A
 */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "../globals.css";

export const metadata: Metadata = {
  title: "PM - Pharmaceutical Governance Value Chain Platform",
  description: "Official platform for the Ministry of Health (MOH) to govern and regulate the pharmaceutical value chain.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-default bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/moh-logo.svg"
              alt="MOH Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-semibold text-text-primary">PM</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link href="/support" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Support
            </Link>
            <Link href="/status" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Status
            </Link>
            <div className="ml-4 flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-default bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/moh-logo.svg"
                alt="MOH Logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="text-sm">© 2025 Ministry of Health. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/legal/terms" className="text-sm hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/legal/privacy" className="text-sm hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/legal/cookies" className="text-sm hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
