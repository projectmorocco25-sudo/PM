/**
 * Wireframe: N/A (Auth Layout)
 * Route: All auth pages (/login, /register, /forgot-password, /reset-password)
 * Implements: Centered layout for authentication pages with minimal header/footer.
 * Wireframe Link: N/A
 */
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Authentication - PM",
  description: "Login, register, or reset your password for the Pharmaceutical Governance Value Chain Platform",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-secondary px-4 py-8">
      {children}
    </div>
  );
}
