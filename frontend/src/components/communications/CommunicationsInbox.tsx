"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Plus, Search } from "lucide-react";

import { useInboxConversations } from "@/hooks/useCommunications";

function formatRelative(iso: string) {
  const ts = new Date(iso).getTime();
  const mins = Math.floor((Date.now() - ts) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function CommunicationsInbox() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useInboxConversations(search, 25);

  const items = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-xl font-semibold text-zinc-900">Inbox</div>
        <Link
          href="/communications/compose"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> New Message
        </Link>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        {isLoading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-zinc-600">No conversations.</div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {items.map((c) => {
              const latest = c.messages?.[0];
              const unread = c.lifecycle_state !== "READ";
              return (
                <li key={c.id}>
                  <Link
                    href={`/communications/inbox/${c.id}`}
                    className={clsx("block px-4 py-4 transition-colors hover:bg-zinc-50", unread && "bg-blue-50/40")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={clsx(
                              "inline-block h-2 w-2 rounded-full",
                              unread ? "bg-blue-600" : "bg-zinc-300",
                            )}
                            aria-hidden="true"
                          />
                          <div
                            className={clsx(
                              "truncate text-sm",
                              unread ? "font-semibold text-zinc-900" : "font-medium text-zinc-800",
                            )}
                          >
                            {c.subject}
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-zinc-600">
                          {latest ? latest.content : "No messages yet."}
                        </div>
                      </div>
                      <div className="shrink-0 text-xs text-zinc-400">
                        {formatRelative(latest?.created_at ?? c.updated_at)}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

