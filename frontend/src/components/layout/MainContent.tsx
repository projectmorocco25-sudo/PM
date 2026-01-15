export function MainContent({
  title,
  breadcrumbs,
  actions,
  children,
}: {
  title?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1">
      {breadcrumbs ? <div className="mb-2 text-sm text-zinc-500">{breadcrumbs}</div> : null}
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <div className="text-xl font-semibold text-zinc-900">{title}</div> : <div />}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

