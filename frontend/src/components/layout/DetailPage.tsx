"use client";

import { useState } from "react";

import { MainContent } from "@/components/layout/MainContent";

export type DetailTab = {
  key: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
};

// Generic detail layout: header (breadcrumbs/title/actions) + tab bar + content
export function DetailPage({
  breadcrumbs,
  title,
  actions,
  tabs,
  defaultTabKey,
}: {
  breadcrumbs?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  tabs: DetailTab[];
  defaultTabKey?: string;
}) {
  const first = tabs.find((t) => !t.disabled)?.key ?? tabs[0]?.key ?? "tab";
  const [active, setActive] = useState(defaultTabKey ?? first);
  const tab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <MainContent breadcrumbs={breadcrumbs} title={title} actions={actions}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={t.disabled}
            className={[
              "rounded-md px-3 py-2 text-sm font-medium",
              t.key === tab.key
                ? "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200"
                : "text-zinc-700 hover:bg-zinc-50",
              t.disabled ? "cursor-not-allowed opacity-50 hover:bg-transparent" : "",
            ].join(" ")}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{tab?.content}</div>
    </MainContent>
  );
}

