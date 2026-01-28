/**
 * Password validation per wireframes 0.5.1.12, 0.5.1.13.
 * Requirements: 8+ chars, 1 upper, 1 lower, 1 number, 1 special.
 */

export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (s: string) => s.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (s: string) => /[A-Z]/.test(s) },
  { id: "lower", label: "One lowercase letter", test: (s: string) => /[a-z]/.test(s) },
  { id: "number", label: "One number", test: (s: string) => /\d/.test(s) },
  { id: "special", label: "One special character", test: (s: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s) },
] as const;

export function checkPasswordRules(password: string): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const r of PASSWORD_RULES) {
    out[r.id] = r.test(password);
  }
  return out;
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}
