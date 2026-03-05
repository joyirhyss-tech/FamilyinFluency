import { useState, useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { XP_PER_LEVEL, YEAR_DAYS } from "./data/constants";
import { updateStreak, shouldResetWeeklyXp, getLevel } from "./utils/xp";
import { DEFAULT_FAMILIES, findFamily, generateFamilyCode } from "./data/families";
import { familyKey } from "./utils/familyKey";
import { useSupabaseSync } from "./hooks/useSupabaseSync";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";

const VALID_VIEWS = ["splash","join","home","dashboard","drill","speak","library","story","flashcards","collage","admin"];
const getHashView = () => {
  const h = window.location.hash.slice(1);
  return VALID_VIEWS.includes(h) ? h : "splash";
};

import { Gate } from "./views/Gate";
import { OwnerDashboard } from "./views/OwnerDashboard";
import { Splash } from "./views/Splash";
import { Join } from "./views/Join";
import { Home } from "./views/Home";
import { Dashboard } from "./views/Dashboard";
import { Drill } from "./views/Drill";
import { Speak } from "./views/Speak";
import { Library } from "./views/Library";
import { StoryReader } from "./views/StoryReader";
import { Flashcards } from "./views/Flashcards";
import { Admin } from "./views/Admin";
import { YearCollage } from "./views/YearCollage";

export default function App() {
  // ── Super Admin auth ────────────────────────────────────────────
  const { isSuperAdmin, signInWithEmail, signOut, loading: authLoading } = useAuth();

  // ── Dynamic family registry ───────────────────────────────────
  const [families, setFamilies] = useLocalStorage("fluency-families", DEFAULT_FAMILIES);

  // Migration: merge any new DEFAULT_FAMILIES entries into localStorage list
  useEffect(() => {
    const existingCodes = new Set(families.map((f) => f.code));
    const missing = DEFAULT_FAMILIES.filter((df) => !existingCodes.has(df.code));
    if (missing.length > 0) {
      setFamilies((prev) => [...prev, ...missing]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createFamily = (name) => {
    if (families.length >= 20) return null;
    const code = generateFamilyCode(families.map((f) => f.code));
    const newFamily = { code, name: name.trim() || "New Circle", owner: false };
    setFamilies((prev) => [...prev, newFamily]);
    return newFamily;
  };

  const deleteFamily = (code) => {
    setFamilies((prev) => prev.map((f) => f.code === code ? { ...f, deleted: true } : f));
  };

  // ── Family gating ──────────────────────────────────────────────
  const [activeFamily, setActiveFamily] = useLocalStorage("fluency-active-family", null);
  const [ownerMode, setOwnerMode] = useState(false);

  // Read ?join= URL parameter (once, on mount)
  const [joinParam] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("join") || null;
  });

  // Clean URL after family is active (remove ?join= param)
  useEffect(() => {
    if (activeFamily && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [activeFamily]);

  // Family activation / deactivation
  const activateFamily = (familyCode) => {
    setActiveFamily(familyCode);
    setView("splash");
  };

  const deactivateFamily = () => {
    setActiveFamily(null);
    setActive(null);
    if (!isSuperAdmin) {
      setOwnerMode(false);
    }
    setView("splash");
  };

  // ── Family-prefixed persisted state ────────────────────────────
  const pfx = activeFamily || "__NONE__";
  const defaultName = activeFamily ? (findFamily(activeFamily, families)?.name || "Family") : "Family";

  const [players, setPlayers] = useLocalStorage(familyKey(pfx, "players"), []);
  const [weekStart, setWeekStart] = useLocalStorage(familyKey(pfx, "week-start"), null);
  const [familyName, setFamilyName] = useLocalStorage(familyKey(pfx, "family-name"), defaultName);
  const [createdAt, setCreatedAt] = useLocalStorage(familyKey(pfx, "created-at"), null);

  // Key for daily words — passed to Home & Dashboard as a prop
  const dailyWordsKey = familyKey(pfx, "daily-words");

  // ── Supabase sync ────────────────────────────────────────────
  const { syncStatus } = useSupabaseSync(activeFamily, {
    players, setPlayers,
    familyName, setFamilyName,
    weekStart, setWeekStart,
    createdAt, setCreatedAt,
    dailyWordsKey,
  });

  // ── Year timer (366 days) ────────────────────────────────────
  // Initialize creation date on first family activation
  useEffect(() => {
    if (activeFamily && createdAt === null) {
      // Use earliest player's start date as fallback for migrated families
      const earliest = players.reduce((min, p) => {
        if (p.startDate && (!min || p.startDate < min)) return p.startDate;
        return min;
      }, null);
      setCreatedAt(earliest || new Date().toISOString());
    }
  }, [activeFamily, createdAt, setCreatedAt, players]);

  // Compute year progress
  const yearProgress = useMemo(() => {
    if (!createdAt) return null;
    const start = new Date(createdAt);
    const now = new Date();
    const elapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const remaining = Math.max(0, YEAR_DAYS - elapsed);
    const complete = elapsed >= YEAR_DAYS;
    return { elapsed: Math.min(elapsed, YEAR_DAYS), remaining, complete };
  }, [createdAt]);

  // ── Session state ──────────────────────────────────────────────
  const [active, setActive] = useState(null);
  const [view, setViewRaw] = useState(getHashView);

  // Sync view → URL hash (Fix #7: hash-based routing for back button)
  const setView = useCallback((v) => {
    setViewRaw(v);
    window.history.pushState(null, "", `#${v}`);
  }, []);

  // Listen for browser back/forward
  useEffect(() => {
    const onPop = () => setViewRaw(getHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Word count for display (lightweight localStorage read)
  // Note: depends on `view` to recompute after daily word submission on Home
  const wordCount = useMemo(() => {
    try {
      const raw = localStorage.getItem(dailyWordsKey);
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  }, [dailyWordsKey, view]);

  const [storyId, setStoryId] = useState(null);
  const [activeLang, setActiveLang] = useState(null);

  // Join form state
  const [joinName, setJoinName] = useState("");
  const [joinLangs, setJoinLangs] = useState(["spanish"]);
  const [joinPaths, setJoinPaths] = useState(["travel"]);
  const [joinDiff, setJoinDiff] = useState(0);
  const [joinLangDiffs, setJoinLangDiffs] = useState({});
  const [joinPin, setJoinPin] = useState("");

  const user = active !== null ? players[active] : null;

  const effectiveUser = user ? {
    ...user,
    lang: activeLang || user.langs?.[0] || user.lang,
  } : null;

  // Weekly XP reset check (moved to effect to avoid side-effects during render)
  useEffect(() => {
    if (shouldResetWeeklyXp(weekStart)) {
      setWeekStart(new Date().toISOString());
      if (players.some((p) => p.weekXp > 0)) {
        setPlayers((prev) => prev.map((p) => ({ ...p, weekXp: 0 })));
      }
    }
  }, [weekStart, players, setWeekStart, setPlayers]);

  // Add XP to active player + update streak
  const addXp = useCallback(
    (amt) => {
      if (active === null) return;
      setPlayers((prev) => {
        const next = [...prev];
        const u = { ...next[active] };
        u.xp += amt;
        u.weekXp += amt;
        u.level = getLevel(u.xp);
        const { streak, lastActiveDate } = updateStreak(u.streak, u.lastActiveDate);
        u.streak = streak;
        u.lastActiveDate = lastActiveDate;
        next[active] = u;
        return next;
      });
    },
    [active, setPlayers]
  );

  // Join program
  const joinProgram = () => {
    if (!joinName.trim() || players.length >= 10 || joinPaths.length === 0 || joinLangs.length === 0 || joinPin.length !== 3) return;
    const langDiffs = {};
    joinLangs.forEach((lang) => {
      langDiffs[lang] = joinLangDiffs[lang] ?? 0;
    });
    const maxDiff = Math.max(...Object.values(langDiffs));
    const p = {
      id: Date.now(),
      name: joinName.trim(),
      colorIdx: players.length,
      lang: joinLangs[0],
      langs: [...joinLangs],
      paths: [...joinPaths],
      diff: maxDiff,
      langDiffs,
      xp: maxDiff * XP_PER_LEVEL * 2,
      weekXp: 0,
      level: maxDiff * 2 + 1,
      streak: 0,
      lastActiveDate: null,
      pin: joinPin,
      startDate: new Date().toISOString(),
    };
    setPlayers((prev) => [...prev, p]);
    setJoinName("");
    setJoinLangs(["spanish"]);
    setJoinPaths(["travel"]);
    setJoinDiff(0);
    setJoinLangDiffs({});
    setJoinPin("");
    setView("home");
  };

  const toggleJoinLang = (lang) => {
    setJoinLangs((prev) =>
      prev.includes(lang) ? prev.filter((x) => x !== lang) : [...prev, lang]
    );
  };

  const toggleJoinPath = (p) => {
    setJoinPaths((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const selectPlayer = (i, pin) => {
    const p = players[i];
    if (p.pin && p.pin !== pin) return false;
    setActive(i);
    setActiveLang(p.langs?.[0] || p.lang);
    setView("dashboard");
    return true;
  };

  const updatePlayer = (i, updates) => {
    setPlayers((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...updates };
      return next;
    });
  };

  const deletePlayer = (i) => {
    if (i === 0 && !isSuperAdmin && !ownerMode) return; // Super admin / owner can delete anyone
    const player = players[i];
    setPlayers((prev) => prev.filter((_, idx) => idx !== i));
    if (active === i) {
      setActive(null);
      setView("home");
    }
    // Soft-delete in Supabase so sync doesn't resurrect the player
    if (supabase && player?.id) {
      supabase
        .from("players")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", player.id)
        .then(({ error }) => {
          if (error) console.warn("[sync] soft-delete error:", error.message);
        });
    }
  };

  const deleteWord = (playerId, date) => {
    try {
      const raw = localStorage.getItem(dailyWordsKey);
      const words = raw ? JSON.parse(raw) : [];
      const filtered = words.filter((w) => !(w.playerId === playerId && w.date === date));
      localStorage.setItem(dailyWordsKey, JSON.stringify(filtered));
      // Trigger ls-change so Supabase sync picks it up
      window.dispatchEvent(new Event("ls-change"));
    } catch { /* ignore */ }
  };

  const isCreator = active === 0 || isSuperAdmin || ownerMode;

  // ── View guards (redirect if missing data) ────────────────────
  useEffect(() => {
    const needsUser = ["dashboard", "drill", "speak", "library", "flashcards"];
    if (needsUser.includes(view) && !effectiveUser) {
      setView("home");
    } else if (view === "story" && (!effectiveUser || !storyId)) {
      setView("library");
    }
  }, [view, effectiveUser, storyId, setView]);

  // When super admin auth lands (e.g. magic link redirect while inside a circle),
  // always clear the active family so we land on the Circle Creator Dashboard
  useEffect(() => {
    if (isSuperAdmin) {
      setOwnerMode(true);
      setActiveFamily(null);
      setActive(null);
    }
  }, [isSuperAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Gate check ─────────────────────────────────────────────────
  if (!activeFamily && !ownerMode) {
    if (authLoading) return null; // Wait for auth session check
    return (
      <Gate
        families={families.filter((f) => !f.deleted)}
        onActivate={activateFamily}
        onOwnerMode={() => { setOwnerMode(true); setActiveFamily(null); setActive(null); setView("splash"); }}
        isSuperAdmin={isSuperAdmin}
        onAdminLogin={signInWithEmail}
        initialCode={joinParam}
      />
    );
  }

  if (ownerMode && !activeFamily) {
    return (
      <OwnerDashboard
        families={families}
        onCreateFamily={createFamily}
        onDeleteFamily={deleteFamily}
        onSelectFamily={activateFamily}
        onBack={() => { setOwnerMode(false); signOut(); }}
      />
    );
  }

  // ── Normal app routing ─────────────────────────────────────────
  switch (view) {
    case "splash":
      return (
        <Splash
          familyName={familyName}
          playerCount={players.length}
          yearProgress={yearProgress}
          wordCount={wordCount}
          onEnterHub={() => setView("home")}
          onGetStarted={() => setView("join")}
          onCollage={() => setView("collage")}
          onSwitchFamily={deactivateFamily}
        />
      );

    case "join":
      return (
        <Join
          playerCount={players.length}
          onBack={() => setView(players.length ? "home" : "splash")}
          onJoin={joinProgram}
          joinName={joinName}
          setJoinName={setJoinName}
          joinLangs={joinLangs}
          toggleJoinLang={toggleJoinLang}
          joinPaths={joinPaths}
          toggleJoinPath={toggleJoinPath}
          joinDiff={joinDiff}
          setJoinDiff={setJoinDiff}
          joinLangDiffs={joinLangDiffs}
          setJoinLangDiffs={setJoinLangDiffs}
          joinPin={joinPin}
          setJoinPin={setJoinPin}
        />
      );

    case "home":
      return (
        <Home
          familyName={familyName}
          players={players}
          dailyWordsKey={dailyWordsKey}
          yearProgress={yearProgress}
          onSelectPlayer={selectPlayer}
          onAddPlayer={() => setView("join")}
          onBack={() => setView("splash")}
          onAdmin={() => setView("admin")}
          onCollage={() => setView("collage")}
          onDeleteWord={deleteWord}
          isCreator={isCreator}
        />
      );

    case "dashboard":
      if (!effectiveUser) return null;
      return (
        <Dashboard
          user={effectiveUser}
          activeLang={activeLang}
          dailyWordsKey={dailyWordsKey}
          onSwitchLang={setActiveLang}
          onBack={() => setView("home")}
          onDrill={() => setView("drill")}
          onSpeak={() => setView("speak")}
          onHome={() => setView("home")}
          onLibrary={() => setView("library")}
          onFlashcards={() => setView("flashcards")}
        />
      );

    case "drill":
      if (!effectiveUser) return null;
      return (
        <Drill
          user={effectiveUser}
          onBack={() => setView("dashboard")}
          onAddXp={addXp}
        />
      );

    case "speak":
      if (!effectiveUser) return null;
      return (
        <Speak
          user={effectiveUser}
          onBack={() => setView("dashboard")}
          onAddXp={addXp}
        />
      );

    case "library":
      if (!effectiveUser) return null;
      return (
        <Library
          user={effectiveUser}
          onBack={() => setView("dashboard")}
          onReadStory={(id) => {
            setStoryId(id);
            setView("story");
          }}
        />
      );

    case "story":
      if (!effectiveUser || !storyId) return null;
      return (
        <StoryReader
          user={effectiveUser}
          storyId={storyId}
          onBack={() => setView("library")}
          onAddXp={addXp}
        />
      );

    case "flashcards":
      if (!effectiveUser) return null;
      return (
        <Flashcards
          user={effectiveUser}
          onBack={() => setView("dashboard")}
          onAddXp={addXp}
        />
      );

    case "collage":
      return (
        <YearCollage
          familyName={familyName}
          createdAt={createdAt}
          dailyWordsKey={dailyWordsKey}
          players={players}
          yearComplete={yearProgress?.complete || false}
          onBack={() => setView(players.length > 0 ? "home" : "splash")}
        />
      );

    case "admin":
      return (
        <Admin
          familyName={familyName}
          onUpdateFamilyName={setFamilyName}
          players={players}
          onUpdatePlayer={updatePlayer}
          onDeletePlayer={deletePlayer}
          onBack={() => setView("home")}
          onSwitchFamily={deactivateFamily}
          isSuperAdmin={isSuperAdmin || ownerMode}
          isCreator={isCreator}
          activeFamily={activeFamily}
        />
      );

    default:
      return null;
  }
}
