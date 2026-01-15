"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type DatePickerProps = {
  value?: string; // yyyy-mm-dd
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
};

export function DatePicker({ value, onChange, id, name, disabled, className }: DatePickerProps) {
  return (
    <input
      id={id}
      name={name}
      type="date"
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}

