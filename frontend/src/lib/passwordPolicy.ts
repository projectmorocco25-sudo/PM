export type PasswordCheck = {
  minLength: boolean;
  lower: boolean;
  upper: boolean;
  digit: boolean;
  symbol: boolean;
};

export function checkPassword(pw: string, minLen = 12): PasswordCheck {
  return {
    minLength: pw.length >= minLen,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

export function isPasswordValid(check: PasswordCheck): boolean {
  return check.minLength && check.lower && check.upper && check.digit && check.symbol;
}

