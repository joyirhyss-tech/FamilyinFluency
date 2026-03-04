import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { pushFamilyData, pullFamilyData, mergeState } from "../lib/syncEngine";

const PULL_INTERVAL = 60_000; // 60 seconds
const PUSH_DEBOUNCE = 2_000; // 2 seconds after last change

/**
 * Sync hook — call once in App.jsx after all useLocalStorage declarations.
 *
 * - Pushes to Supabase on local changes (debounced 2s via ls-change events)
 * - Pulls from Supabase every 60s, on tab focus, and on reconnect
 * - Merges remote data into local state using conflict resolution
 * - Returns { syncStatus, lastSyncAt } for optional UI indicator
 *
 * syncStatus: "idle" | "pushing" | "pulling" | "error" | "offline"
 */
export function useSupabaseSync(familyCode, state) {
  const {
    players, setPlayers,
    familyName, setFamilyName,
    weekStart, setWeekStart,
    createdAt, setCreatedAt,
    dailyWordsKey,
  } = state;

  const [syncStatus, setSyncStatus] = useState(supabase ? "idle" : "offline");
  const [lastSyncAt, setLastSyncAt] = useState(null);

  // Refs to avoid stale closures
  const stateRef = useRef(state);
  stateRef.current = state;

  const pushTimerRef = useRef(null);
  const isSyncingRef = useRef(false);
  const mountedRef = useRef(true);

  // ── Read daily words from localStorage ──
  const readDailyWords = useCallback(() => {
    try {
      const raw = localStorage.getItem(dailyWordsKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [dailyWordsKey]);

  // ── PUSH ──
  const push = useCallback(async () => {
    if (!supabase || !familyCode || isSyncingRef.current) return;
    isSyncingRef.current = true;
    if (mountedRef.current) setSyncStatus("pushing");

    try {
      const s = stateRef.current;
      await pushFamilyData(supabase, familyCode, {
        familyName: s.familyName,
        weekStart: s.weekStart,
        createdAt: s.createdAt,
        players: s.players,
        dailyWords: readDailyWords(),
      });
      if (mountedRef.current) {
        setSyncStatus("idle");
        setLastSyncAt(new Date());
      }
    } catch (err) {
      console.warn("[sync] push failed:", err.message);
      if (mountedRef.current) setSyncStatus("error");
    } finally {
      isSyncingRef.current = false;
    }
  }, [familyCode, readDailyWords]);

  // ── PULL + MERGE ──
  const pull = useCallback(async () => {
    if (!supabase || !familyCode || isSyncingRef.current) return;
    isSyncingRef.current = true;
    if (mountedRef.current) setSyncStatus("pulling");

    try {
      const remote = await pullFamilyData(supabase, familyCode);
      if (!remote || !mountedRef.current) {
        if (mountedRef.current) setSyncStatus("idle");
        isSyncingRef.current = false;
        return;
      }

      const s = stateRef.current;
      const localState = {
        familyName: s.familyName,
        weekStart: s.weekStart,
        createdAt: s.createdAt,
        players: s.players,
        dailyWords: readDailyWords(),
      };

      const changes = mergeState(localState, remote);

      if (changes && mountedRef.current) {
        if (changes.familyName !== undefined) s.setFamilyName(changes.familyName);
        if (changes.weekStart !== undefined) s.setWeekStart(changes.weekStart);
        if (changes.createdAt !== undefined) s.setCreatedAt(changes.createdAt);
        if (changes.players) s.setPlayers(changes.players);
        if (changes.dailyWords) {
          try {
            localStorage.setItem(dailyWordsKey, JSON.stringify(changes.dailyWords));
          } catch { /* quota */ }
        }
      }

      if (mountedRef.current) {
        setSyncStatus("idle");
        setLastSyncAt(new Date());
      }
    } catch (err) {
      console.warn("[sync] pull failed:", err.message);
      if (mountedRef.current) setSyncStatus("error");
    } finally {
      isSyncingRef.current = false;
    }
  }, [familyCode, dailyWordsKey, readDailyWords]);

  // ── Full sync: push then pull ──
  const sync = useCallback(async () => {
    await push();
    await pull();
  }, [push, pull]);

  // ── Listen for ls-change events (debounced push) ──
  useEffect(() => {
    if (!supabase || !familyCode) return;

    const handleChange = () => {
      clearTimeout(pushTimerRef.current);
      pushTimerRef.current = setTimeout(() => {
        push();
      }, PUSH_DEBOUNCE);
    };

    window.addEventListener("ls-change", handleChange);
    return () => {
      window.removeEventListener("ls-change", handleChange);
      clearTimeout(pushTimerRef.current);
    };
  }, [familyCode, push]);

  // ── Tab focus → sync ──
  useEffect(() => {
    if (!supabase || !familyCode) return;

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        pull();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [familyCode, pull]);

  // ── Online → sync ──
  useEffect(() => {
    if (!supabase || !familyCode) return;

    const handleOnline = () => sync();
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [familyCode, sync]);

  // ── Periodic pull (60s) ──
  useEffect(() => {
    if (!supabase || !familyCode) return;

    const interval = setInterval(pull, PULL_INTERVAL);
    return () => clearInterval(interval);
  }, [familyCode, pull]);

  // ── Initial sync on mount / family change ──
  useEffect(() => {
    if (!supabase || !familyCode) return;

    // Small delay to let localStorage settle after family activation
    const timer = setTimeout(sync, 500);
    return () => clearTimeout(timer);
  }, [familyCode, sync]);

  // ── Cleanup ──
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  return { syncStatus, lastSyncAt };
}
