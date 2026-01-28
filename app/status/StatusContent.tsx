"use client";

/**
 * Wireframe: task-0.5.1.41-system-status.md
 * System status UI: overall banner, components, incidents, maintenance.
 * Data from system_get_status_public(). Auto-refresh 60s.
 */

import { useSystemStatus } from "@/hooks/use-system-status";

function formatTimeAgo(at: string): string {
  const d = new Date(at);
  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffMins >= 60) return `${Math.floor(diffMins / 60)} hours ago`;
  if (diffMins >= 1) return `${diffMins} minutes ago`;
  if (diffSecs >= 1) return `${diffSecs} seconds ago`;
  return "Just now";
}

function StatusDot({ status }: { status: string }) {
  const green = status === "operational";
  const yellow = status === "degraded";
  const red = status === "outage";
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={status}>
      {green && <span className="h-3 w-3 rounded-full bg-[#10b981]" aria-hidden />}
      {yellow && <span className="h-3 w-3 rounded-full bg-[#f59e0b]" aria-hidden />}
      {red && <span className="h-3 w-3 rounded-full bg-[#ef4444]" aria-hidden />}
      <span className="capitalize">{status}</span>
    </span>
  );
}

export function StatusContent() {
  const { data, status, error, refetch } = useSystemStatus();

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-[1200px] space-y-8 px-6 py-10 md:py-12">
        <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">System Status</h1>
        <div className="h-24 animate-pulse rounded-lg bg-[#e5e7eb]" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border border-[#e5e7eb] bg-white" />
          ))}
        </div>
        <div className="h-48 animate-pulse rounded-lg border border-[#e5e7eb] bg-white" />
        <div className="h-32 animate-pulse rounded-lg border border-[#3b82f6] bg-[#eff6ff]" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6 px-6 py-10 md:py-12">
        <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">System Status</h1>
        <div className="rounded-lg border border-[#ef4444] bg-[#fef2f2] p-6 text-[#991b1b]">
          <p className="font-medium">Unable to load system status.</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 rounded-lg bg-[#ef4444] px-4 py-2 text-sm font-medium text-white hover:bg-[#dc2626] focus:outline focus:outline-2 focus:outline-[#ef4444] focus:outline-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (status === "empty" || !data) {
    return (
      <div className="mx-auto max-w-[1200px] space-y-6 px-6 py-10 md:py-12">
        <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">System Status</h1>
        <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6 text-[#4b5563]">
          <p>No status information available.</p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 text-sm font-medium text-[#2563eb] hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overall, components, incidents, maintenance, at } = data;
  const bg =
    overall === "outage"
      ? "#ef4444"
      : overall === "degraded"
        ? "#f59e0b"
        : "#10b981";
  const overallLabel =
    overall === "outage"
      ? "System Outage"
      : overall === "degraded"
        ? "System Degraded"
        : "All Systems Operational";

  return (
    <div className="mx-auto max-w-[1200px] space-y-12 px-6 py-10 md:py-12">
      <h1 className="text-[28px] font-bold text-[#111827] md:text-[36px]">System Status</h1>

      {/* Overall status */}
      <section
        className="rounded-lg p-6 text-white"
        style={{ backgroundColor: bg }}
        aria-label="Overall status"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/30"
            aria-hidden
          >
            {overall === "operational" && (
              <span className="h-3 w-3 rounded-full bg-white" />
            )}
            {overall === "degraded" && (
              <span className="h-3 w-3 rounded-full bg-[#fef3c7]" />
            )}
            {overall === "outage" && (
              <span className="h-3 w-3 rounded-full bg-[#fecaca]" />
            )}
          </span>
          <span className="text-[24px] font-semibold">{overallLabel}</span>
        </div>
        <p className="mt-2 text-sm opacity-90">Last updated: {formatTimeAgo(at)}</p>
      </section>

      {/* System components */}
      <section aria-labelledby="components-heading">
        <h2 id="components-heading" className="mb-6 text-[28px] font-semibold text-[#111827]">
          System Components
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {components.map((c) => (
            <div
              key={c.name}
              className="rounded-lg border border-[#e5e7eb] bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-[#111827]">{c.name}</h3>
              <div className="mt-2">
                <StatusDot status={c.status} />
              </div>
              <p className="mt-2 text-base text-[#4b5563]">{c.uptime} uptime</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incident history */}
      <section
        className="rounded-lg border border-[#e5e7eb] bg-white p-8"
        aria-labelledby="incidents-heading"
      >
        <h2 id="incidents-heading" className="text-[28px] font-semibold text-[#111827]">
          Incident History
        </h2>
        <h3 className="mt-4 text-lg font-medium text-[#111827]">Resolved Issues</h3>
        {incidents.length === 0 ? (
          <p className="mt-4 text-base text-[#4b5563]">No resolved incidents.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {incidents.map((i, idx) => (
              <li key={idx} className="border-b border-[#e5e7eb] pb-4 last:border-b-0 last:pb-0">
                <p className="font-medium text-[#111827]">{i.title}</p>
                <p className="mt-1 text-sm text-[#4b5563]">Date: {i.date}</p>
                <p className="text-sm text-[#4b5563]">Duration: {i.duration}</p>
                <p className="text-sm text-[#4b5563]">Status: {i.status}</p>
              </li>
            ))}
          </ul>
        )}
        {incidents.length > 0 && (
          <a
            href="#incidents-heading"
            className="mt-6 inline-block text-base font-medium text-[#2563eb] hover:underline focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
          >
            View All Incidents →
          </a>
        )}
      </section>

      {/* Maintenance schedule */}
      <section
        className="rounded-lg border-2 border-[#3b82f6] bg-[#eff6ff] p-8"
        aria-labelledby="maintenance-heading"
      >
        <h2 id="maintenance-heading" className="text-[28px] font-semibold text-[#111827]">
          Maintenance Schedule
        </h2>
        <p className="mt-4 text-lg font-medium text-[#111827]">Upcoming Maintenance:</p>
        {maintenance.length === 0 ? (
          <p className="mt-4 text-base text-[#4b5563]">No other scheduled maintenance.</p>
        ) : (
          <ul className="mt-4 space-y-6">
            {maintenance.map((m, idx) => (
              <li key={idx}>
                <p className="font-medium text-[#111827]">{m.title}</p>
                <p className="mt-1 text-sm text-[#4b5563]">Date: {m.date}</p>
                <p className="text-sm text-[#4b5563]">Time: {m.time}</p>
                <p className="text-sm text-[#4b5563]">Impact: {m.impact}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
