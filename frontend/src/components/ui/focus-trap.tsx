"use client";

import * as React from "react";

function getFocusable(root: HTMLElement) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"),
  );
}

export function FocusTrap({
  active = true,
  children,
  initialFocusRef,
}: {
  active?: boolean;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!active) return;
    const root = ref.current;
    if (!root) return;

    const prev = document.activeElement as HTMLElement | null;
    const focusFirst = () => {
      const target = initialFocusRef?.current;
      if (target) target.focus();
      else getFocusable(root)[0]?.focus();
    };
    focusFirst();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusable(root);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (!current || current === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!current || current === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prev?.focus?.();
    };
  }, [active, initialFocusRef]);

  return <div ref={ref}>{children}</div>;
}

