"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100", className)}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  alt,
  src,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "fill"> & { className?: string }) {
  return (
    <Image
      fill
      src={src}
      alt={alt ?? ""}
      className={cn("object-cover", className)}
      sizes="36px"
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center rounded-full text-xs font-semibold text-zinc-700", className)}
      {...props}
    />
  );
}

