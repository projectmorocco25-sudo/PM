"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { useApp } from "@/contexts/AppContext";
import { useSentConversations } from "@/hooks/useCommunications";

export function SentMessages() {
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSentConversations(user?.id, search, 25);

  const items = useMemo(() => data ?? [], [data]);

  return (
    <div>
      <div className="mb-4 text-xl font-semibold text-zinc-900">Sent</div>

      <div className="mb-4">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sent conversations..."
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        {isLoading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-zinc-600">No sent conversations.</div>
        ) : (
          <ul className="divide-y divide-zinc-200">
            {items.map((c) => {
              const latest = c.messages?.[0];
              return (
                <li key={c.id}>
                  <Link href={`/communications/inbox/${c.id}`} className="block px-4 py-4 hover:bg-zinc-50">
                    <div className="text-sm font-semibold text-zinc-900">{c.subject}</div>
                    <div className="mt-1 text-sm text-zinc-600">{latest?.content ?? "No messages yet."}</div>
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

