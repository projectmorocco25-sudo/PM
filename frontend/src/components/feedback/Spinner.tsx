export function Spinner({ label }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-zinc-600">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

