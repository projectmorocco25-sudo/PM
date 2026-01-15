export function ProgressBar({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded bg-zinc-200" aria-label="Progress">
      <div className="h-full bg-zinc-900" style={{ width: `${clamped}%` }} />
    </div>
  );
}

