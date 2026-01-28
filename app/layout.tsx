import type { Metadata } from "next";
import "./globals.css";

/** Inline SVG favicon (data URL) to avoid dynamic /icon route ERR_EMPTY_RESPONSE. */
const FAVICON_SVG =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjM2I4MmY2Ii8+PC9zdmc+";

export const metadata: Metadata = {
  title: "PM — Pharmaceutical Governance",
  description: "Pharmaceutical Governance Value Chain Platform",
  icons: { icon: { url: FAVICON_SVG, type: "image/svg+xml" } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
