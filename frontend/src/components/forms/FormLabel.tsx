"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function FormLabel({
  className,
  children,
  required,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn("mb-1 block text-sm font-medium text-zinc-700", className)} {...props}>
      {children}
      {required ? <span className="ml-1 text-red-600">*</span> : null}
    </label>
  );
}

