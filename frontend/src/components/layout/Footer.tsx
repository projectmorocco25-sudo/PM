export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 text-sm text-zinc-600">
        <div>© {new Date().getFullYear()} Ministry of Health — Pharmaceutical Monitoring Platform</div>
      </div>
    </footer>
  );
}

