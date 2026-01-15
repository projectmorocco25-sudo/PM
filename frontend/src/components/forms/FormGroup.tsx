"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function FormGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

