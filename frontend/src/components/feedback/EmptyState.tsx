export function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
      <div className="text-base font-semibold text-zinc-900">{title}</div>
      {message ? <div className="mt-1 text-zinc-600">{message}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

