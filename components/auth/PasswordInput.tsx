"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
};

export function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter your password",
  required,
  error,
  disabled,
  "aria-describedby": ariaDescribedby,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[#111827]"
      >
        {label}
        {required && <span className="text-[#ef4444]" aria-hidden> *</span>}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : ariaDescribedby}
          className={`h-10 w-full rounded-md border pr-10 pl-3 text-base text-[#111827] transition-colors placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] disabled:cursor-not-allowed disabled:bg-[#f3f4f6] ${
            error
              ? "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]"
              : "border-[#e5e7eb]"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#6b7280] hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-1"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[#ef4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
