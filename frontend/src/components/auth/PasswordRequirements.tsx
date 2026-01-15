import { checkPassword } from "@/lib/passwordPolicy";

function Row({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={ok ? "text-green-700" : "text-zinc-500"}>{ok ? "✓" : "•"}</span>
      <span className={ok ? "text-zinc-900" : "text-zinc-600"}>{label}</span>
    </li>
  );
}

export function PasswordRequirements({ password }: { password: string }) {
  const c = checkPassword(password, 12);
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
      <div className="font-medium text-zinc-900">Password requirements:</div>
      <ul className="mt-2 space-y-1">
        <Row ok={c.minLength} label="At least 12 characters" />
        <Row ok={c.upper} label="One uppercase letter" />
        <Row ok={c.lower} label="One lowercase letter" />
        <Row ok={c.digit} label="One number" />
        <Row ok={c.symbol} label="One special character" />
      </ul>
    </div>
  );
}

