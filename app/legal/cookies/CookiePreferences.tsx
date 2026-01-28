"use client";

/**
 * Wireframe: task-0.5.1.9-cookie-policy.md
 * Cookie Preferences: Essential (checked, disabled), Functional, Analytics. Save Preferences.
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "pm-cookie-preferences";

type Prefs = { functional: boolean; analytics: boolean };

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return { functional: false, analytics: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Prefs;
      return { functional: !!p.functional, analytics: !!p.analytics };
    }
  } catch {
    /* ignore */
  }
  return { functional: false, analytics: false };
}

export function CookiePreferences() {
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = loadPrefs();
    setFunctional(p.functional);
    setAnalytics(p.analytics);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 400));
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ functional, analytics })
      );
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="cookie-preferences"
      className="mt-8 scroll-mt-8 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-8"
      aria-labelledby="cookie-prefs-heading"
    >
      <h2 id="cookie-prefs-heading" className="text-[24px] font-semibold text-[#111827]">
        6. Your Cookie Choices
      </h2>
      <p className="mt-2 text-base text-[#4b5563]">Cookie Preferences</p>

      {saved && (
        <div
          className="mt-4 rounded-lg border border-[#22c55e] bg-[#f0fdf4] p-4 text-[#166534]"
          role="alert"
        >
          Preferences saved.
        </div>
      )}

      <div className="mt-6 space-y-4">
        <label className="flex cursor-default items-start gap-3 opacity-80">
          <input
            type="checkbox"
            checked
            disabled
            className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6]"
            aria-describedby="essential-desc"
          />
          <span id="essential-desc" className="text-base text-[#111827]">
            <strong>Essential Cookies (Required)</strong> — Cannot be disabled
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={functional}
            onChange={(e) => setFunctional(e.target.checked)}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
            aria-describedby="functional-desc"
          />
          <span id="functional-desc" className="text-base text-[#111827]">
            <strong>Functional Cookies</strong> — Enhance functionality
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            disabled={loading}
            className="mt-1 h-4 w-4 rounded border-[#e5e7eb] text-[#3b82f6] focus:ring-[#3b82f6]"
            aria-describedby="analytics-desc"
          />
          <span id="analytics-desc" className="text-base text-[#111827]">
            <strong>Analytics Cookies</strong> — Help us improve the platform
          </span>
        </label>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="mt-6 flex h-10 min-w-[160px] items-center justify-center rounded-lg bg-[#3b82f6] px-5 text-sm font-medium text-white hover:bg-[#2563eb] disabled:opacity-70 focus:outline focus:outline-2 focus:outline-[#3b82f6] focus:outline-offset-2"
      >
        {loading ? "Saving…" : "Save Preferences"}
      </button>
    </section>
  );
}
