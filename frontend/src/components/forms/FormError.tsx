"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function FormError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-xs font-medium text-red-600", className)} {...props} />;
}

