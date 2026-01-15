export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

