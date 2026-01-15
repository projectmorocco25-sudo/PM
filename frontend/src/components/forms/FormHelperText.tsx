"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function FormHelperText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-xs text-zinc-500", className)} {...props} />;
}

