export function Input({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  rightElement,
  error,
  autoComplete,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rightElement?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium text-zinc-900">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "h-10 w-full rounded-md border px-3 pr-10 text-sm outline-none",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-zinc-200 focus:border-zinc-400",
          ].join(" ")}
        />
        {rightElement ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{rightElement}</div>
        ) : null}
      </div>
      {error ? <div className="mt-1 text-xs text-red-600">{error}</div> : null}
    </label>
  );
}

