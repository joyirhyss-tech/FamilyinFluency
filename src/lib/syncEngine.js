/**
 * Sync engine — pure functions for push / pull / merge with Supabase.
 * No React imports; consumed by useSupabaseSync hook.
 */

// ── PUSH ──────────────────────────────────────────────────────────

/**
 * Push local family state up to Supabase.
 * Uses upserts so it's safe to call repeatedly.
 */
export async function pushFamilyData(supabase, familyCode, local) {
  if (!supabase || !familyCode) return;

  const now = new Date().toISOString();

  // 1. Upsert family row
  const { error: famErr } = await supabase
    .from("families")
    .upsert(
      {
        code: familyCode,
        name: local.familyName || "Family",
        week_start: local.weekStart || null,
        created_at: local.createdAt || now,
        updated_at: now,
      },
      { onConflict: "code" }
    );
  if (famErr) console.warn("[sync] push family error:", famErr.message);

  // 2. Upsert players
  if (local.players?.length) {
    const playerRows = local.players.map((p, i) => ({
      id: p.id,
      family_code: familyCode,
      name: p.name,
      color_idx: p.colorIdx ?? 0,
      langs: p.langs || [p.lang || "spanish"],
      paths: p.paths || ["travel"],
      lang_diffs: p.langDiffs || {},
      diff: p.diff ?? 0,
      xp: p.xp ?? 0,
      week_xp: p.weekXp ?? 0,
      level: p.level ?? 1,
      streak: p.streak ?? 0,
      last_active_date: p.lastActiveDate || null,
      pin: null, // PINs are local-only — never sync to Supabase
      start_date: p.startDate || null,
      sort_order: i,
      updated_at: now,
      // deleted_at intentionally omitted — never overwrite soft-delete flags
    }));

    const { error: plErr } = await supabase
      .from("players")
      .upsert(playerRows, { onConflict: "id" });
    if (plErr) console.warn("[sync] push players error:", plErr.message);
  }

  // 3. Upsert daily words
  if (local.dailyWords?.length) {
    const wordRows = local.dailyWords.map((w) => ({
      family_code: familyCode,
      player_id: w.playerId,
      date: w.date,
      word: w.word,
      prompt: w.prompt || null,
      updated_at: now,
    }));

    // Batch in groups of 500 to stay under Supabase limits
    for (let i = 0; i < wordRows.length; i += 500) {
      const batch = wordRows.slice(i, i + 500);
      const { error: wErr } = await supabase
        .from("daily_words")
        .upsert(batch, { onConflict: "family_code,player_id,date" });
      if (wErr) console.warn("[sync] push words error:", wErr.message);
    }
  }
}

// ── PULL ──────────────────────────────────────────────────────────

/**
 * Pull all family data from Supabase.
 * Returns { family, players, dailyWords } or null on error.
 */
export async function pullFamilyData(supabase, familyCode) {
  if (!supabase || !familyCode) return null;

  try {
    const [famRes, plRes, wRes] = await Promise.all([
      supabase.from("families").select("*").eq("code", familyCode).single(),
      supabase
        .from("players")
        .select("*")
        .eq("family_code", familyCode)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("daily_words")
        .select("*")
        .eq("family_code", familyCode),
    ]);

    if (famRes.error && famRes.error.code !== "PGRST116") {
      // PGRST116 = no rows found (family not pushed yet) — that's OK
      console.warn("[sync] pull family error:", famRes.error.message);
      return null;
    }

    return {
      family: famRes.data || null,
      players: plRes.data || [],
      dailyWords: wRes.data || [],
    };
  } catch (err) {
    console.warn("[sync] pull error:", err.message);
    return null;
  }
}

// ── MERGE ─────────────────────────────────────────────────────────

/**
 * Merge remote Supabase data into local state.
 * Returns an object of updated values (only keys that changed).
 *
 * Conflict resolution:
 *  - Family settings: last-write-wins by updated_at
 *  - Players: union by id; Math.max for xp/streak; last-write-wins for other fields
 *  - Daily words: union by (playerId, date); remote wins ties
 *  - Deleted players (deleted_at set) are filtered out
 */
export function mergeState(local, remote) {
  if (!remote || !remote.family) return null;

  const changes = {};

  // ── Family settings ──
  if (remote.family) {
    const remoteUpdated = new Date(remote.family.updated_at || 0).getTime();

    // Family name
    if (remote.family.name && remote.family.name !== local.familyName) {
      // Remote wins if it was updated more recently
      // For simplicity, always take remote name if different (server is source of truth for settings)
      changes.familyName = remote.family.name;
    }

    // Week start
    if (remote.family.week_start !== undefined) {
      const remoteWS = remote.family.week_start;
      if (remoteWS !== local.weekStart) {
        changes.weekStart = remoteWS;
      }
    }

    // Created at — take the earliest
    if (remote.family.created_at) {
      const localCreated = local.createdAt ? new Date(local.createdAt).getTime() : Infinity;
      const remoteCreated = new Date(remote.family.created_at).getTime();
      if (remoteCreated < localCreated) {
        changes.createdAt = remote.family.created_at;
      }
    }
  }

  // ── Players ──
  if (remote.players?.length) {
    const localById = {};
    (local.players || []).forEach((p) => { localById[p.id] = p; });

    const merged = [];
    const seen = new Set();

    // Start with remote players (sorted by sort_order)
    for (const rp of remote.players) {
      // Skip soft-deleted
      if (rp.deleted_at) {
        seen.add(rp.id);
        continue;
      }

      seen.add(rp.id);
      const lp = localById[rp.id];

      if (!lp) {
        // New from remote — convert to local shape
        merged.push(remotePlayerToLocal(rp));
      } else {
        // Merge: Math.max for xp/streak, keep higher values
        merged.push(mergePlayers(lp, rp));
      }
    }

    // Add any local-only players not seen in remote
    for (const lp of local.players || []) {
      if (!seen.has(lp.id)) {
        merged.push(lp);
      }
    }

    // Only set changes if actually different
    if (playersChanged(local.players || [], merged)) {
      changes.players = merged;
    }
  }

  // ── Daily words ──
  if (remote.dailyWords?.length) {
    const localWords = local.dailyWords || [];
    const wordMap = {};

    // Index local words
    for (const w of localWords) {
      const key = `${w.playerId}-${w.date}`;
      wordMap[key] = w;
    }

    // Merge remote words (remote wins ties)
    let wordsChanged = false;
    for (const rw of remote.dailyWords) {
      const key = `${rw.player_id}-${rw.date}`;
      const existing = wordMap[key];
      const remoteWord = {
        playerId: rw.player_id,
        date: rw.date,
        word: rw.word,
        prompt: rw.prompt || undefined,
      };

      if (!existing) {
        wordMap[key] = remoteWord;
        wordsChanged = true;
      } else if (existing.word !== rw.word) {
        // Remote wins ties
        wordMap[key] = remoteWord;
        wordsChanged = true;
      }
    }

    if (wordsChanged) {
      changes.dailyWords = Object.values(wordMap);
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
}

// ── Helpers ───────────────────────────────────────────────────────

function remotePlayerToLocal(rp) {
  return {
    id: rp.id,
    name: rp.name,
    colorIdx: rp.color_idx ?? 0,
    lang: rp.langs?.[0] || "spanish",
    langs: rp.langs || ["spanish"],
    paths: rp.paths || ["travel"],
    diff: rp.diff ?? 0,
    langDiffs: rp.lang_diffs || {},
    xp: rp.xp ?? 0,
    weekXp: rp.week_xp ?? 0,
    level: rp.level ?? 1,
    streak: rp.streak ?? 0,
    lastActiveDate: rp.last_active_date || null,
    pin: rp.pin || null,
    startDate: rp.start_date || null,
  };
}

function mergePlayers(local, remote) {
  return {
    ...local,
    // Numeric fields: take the higher value (XP/streak can only go up)
    xp: Math.max(local.xp ?? 0, remote.xp ?? 0),
    weekXp: Math.max(local.weekXp ?? 0, remote.week_xp ?? 0),
    level: Math.max(local.level ?? 1, remote.level ?? 1),
    streak: Math.max(local.streak ?? 0, remote.streak ?? 0),
    // Other fields: take remote if it was updated more recently
    name: remote.name || local.name,
    colorIdx: remote.color_idx ?? local.colorIdx,
    langs: remote.langs?.length ? remote.langs : local.langs,
    paths: remote.paths?.length ? remote.paths : local.paths,
    diff: remote.diff ?? local.diff,
    langDiffs: Object.keys(remote.lang_diffs || {}).length
      ? remote.lang_diffs
      : local.langDiffs,
    lastActiveDate: laterDate(local.lastActiveDate, remote.last_active_date),
    pin: remote.pin ?? local.pin,
    startDate: remote.start_date || local.startDate,
  };
}

function laterDate(a, b) {
  if (!a) return b || null;
  if (!b) return a;
  return a > b ? a : b;
}

function playersChanged(oldPlayers, newPlayers) {
  if (oldPlayers.length !== newPlayers.length) return true;
  for (let i = 0; i < oldPlayers.length; i++) {
    const o = oldPlayers[i];
    const n = newPlayers[i];
    if (
      o.id !== n.id ||
      o.xp !== n.xp ||
      o.weekXp !== n.weekXp ||
      o.streak !== n.streak ||
      o.level !== n.level ||
      o.name !== n.name ||
      o.lastActiveDate !== n.lastActiveDate ||
      JSON.stringify(o.langs) !== JSON.stringify(n.langs) ||
      JSON.stringify(o.langDiffs) !== JSON.stringify(n.langDiffs)
    ) {
      return true;
    }
  }
  return false;
}
