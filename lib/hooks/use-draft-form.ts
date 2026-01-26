/**
 * useDraftForm — Phase 5 Task 5.3
 * Auto-save form drafts to localStorage (30s interval or manual), load on mount, clear on submit.
 * Wireframe: "💾 Draft saved automatically - Last saved: [time]", [Save Draft], load draft, clear on submit.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_INTERVAL_MS = 30_000;

export function useDraftForm<T extends Record<string, unknown>>(
  storageKey: string,
  getSnapshot: () => T,
  options?: { intervalMs?: number; enabled?: boolean }
) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { intervalMs = DEFAULT_INTERVAL_MS, enabled = true } = options ?? {};
  const getRef = useRef(getSnapshot);
  getRef.current = getSnapshot;

  const saveDraft = useCallback(() => {
    if (!enabled) return;
    try {
      const snap = getRef.current();
      localStorage.setItem(storageKey, JSON.stringify(snap));
      setLastSaved(new Date());
    } catch {
      /* ignore */
    }
  }, [storageKey, enabled]);

  const loadDraft = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setLastSaved(null);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    if (!enabled) return;
    const t = setInterval(saveDraft, intervalMs);
    return () => clearInterval(t);
  }, [enabled, intervalMs, saveDraft]);

  return { saveDraft, loadDraft, clearDraft, lastSaved };
}
