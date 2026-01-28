"use client";

import { PASSWORD_RULES, checkPasswordRules } from "@/lib/password-validation";
import { Check, X } from "lucide-react";

type PasswordRequirementsProps = {
  password: string;
  id?: string;
};

export function PasswordRequirements({ password, id }: PasswordRequirementsProps) {
  const results = checkPasswordRules(password);

  return (
    <div
      id={id}
      className="rounded-md border border-[#e5e7eb] bg-[#f9fafb] p-3"
      role="status"
      aria-live="polite"
    >
      <ul className="space-y-1.5 text-sm text-[#4b5563]">
        {PASSWORD_RULES.map((r) => (
          <li
            key={r.id}
            className={`flex items-center gap-2 ${results[r.id] ? "text-[#059669]" : ""}`}
          >
            {results[r.id] ? (
              <Check className="h-4 w-4 shrink-0" aria-hidden />
            ) : (
              <X className="h-4 w-4 shrink-0 text-[#9ca3af]" aria-hidden />
            )}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
