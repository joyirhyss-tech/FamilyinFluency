# QA Audit Review -- Family inFluency
**Reviewer:** Senior Engineering Review Agent
**Date:** 2026-03-04

---

## Overall Assessment

**App Quality:** Family inFluency is a well-crafted, feature-rich family language learning app. The code is clean, well-organized, and follows reasonable React patterns. The visual design (notebook/stationery theme) is consistent and the component architecture is solid. The offline-first approach with optional Supabase sync is a good architectural decision for the target audience.

**QA Report Quality:** The QA audit was thorough and accurate. All findings were verified against the actual source code. The tester correctly identified the primary issues and provided reasonable context. A few findings had slightly inaccurate line numbers (expected since code may have shifted), but the descriptions and file references were all correct. The QA tester missed a handful of issues that this review identifies below.

---

## Critical Fixes (Must Do)

### 1. Hardcoded 366-Day Year (Confirmed -- Medium-High Priority)

**QA Finding Verified: YES**

The number 366 is hardcoded in 6 locations across 4 files. Since the year 2026 is not a leap year (365 days), this causes incorrect day counts throughout the app.

**Affected Files and Lines:**

| File | Line | Code |
|------|------|------|
| `src/App.jsx` | 94 | `const remaining = Math.max(0, 366 - elapsed);` |
| `src/App.jsx` | 95 | `const complete = elapsed >= 366;` |
| `src/App.jsx` | 96 | `return { elapsed: Math.min(elapsed, 366), remaining, complete };` |
| `src/views/Splash.jsx` | 6 | `const pct = Math.min(100, (daysElapsed / 366) * 100);` |
| `src/views/Splash.jsx` | 36 | `Day {daysElapsed} of 366` |
| `src/views/Home.jsx` | 345 | `Day ${yearProgress.elapsed} of 366` |
| `src/views/Home.jsx` | 354 | `/366` |
| `src/views/Home.jsx` | 361 | `(yearProgress.elapsed / 366) * 100` |
| `src/views/YearCollage.jsx` | 38 | `endDate.setDate(endDate.getDate() + 366);` |
| `src/views/YearCollage.jsx` | 322 | `"366 days"` |

**Difficulty:** Easy

**Suggested Fix:** Create a utility function in `src/utils/xp.js` or a new `src/utils/year.js`:

```javascript
export function daysInYearSpan(startDateISO) {
  const start = new Date(startDateISO);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}
```

Then in `App.jsx`, compute `totalDays` once using this function and pass it as a prop (alongside `yearProgress`) to all consuming components. This eliminates all 10+ hardcoded 366 values with a single source of truth.

---

### 2. Side Effects During Render in App.jsx (Confirmed -- Medium-High Priority)

**QA Finding Verified: YES**

**File:** `src/App.jsx`, lines 130-135

```javascript
if (shouldResetWeeklyXp(weekStart)) {
  setWeekStart(new Date().toISOString());
  if (players.some((p) => p.weekXp > 0)) {
    setPlayers((prev) => prev.map((p) => ({ ...p, weekXp: 0 })));
  }
}
```

This code calls `setWeekStart` and `setPlayers` directly in the render body. In React 19 with StrictMode (which is enabled in `main.jsx` line 11), components render twice in development to help detect impure renders. This means:

- `setWeekStart` fires twice, writing two ISO strings slightly apart
- `setPlayers` could fire twice, though the functional update form mitigates data corruption

This is an anti-pattern that can cause subtle bugs and unnecessary re-renders.

**Difficulty:** Easy

**Suggested Fix:** Move to a `useEffect`:

```javascript
useEffect(() => {
  if (shouldResetWeeklyXp(weekStart)) {
    setWeekStart(new Date().toISOString());
    if (players.some((p) => p.weekXp > 0)) {
      setPlayers((prev) => prev.map((p) => ({ ...p, weekXp: 0 })));
    }
  }
}, [weekStart, players, setWeekStart, setPlayers]);
```

---

### 3. PIN Stored in Plain Text and Synced to Supabase (MISSED by QA -- Medium-High Priority)

**File:** `src/lib/syncEngine.js`, line 48
**File:** `src/data/families.js`, line 19

The player PIN is stored as a plain 3-digit string in localStorage and pushed directly to Supabase in the `players` table (`pin: p.pin || null`). While a 3-digit PIN has minimal security value, it establishes a bad pattern:

- PINs are visible in Supabase database to anyone with the anon key
- PINs are visible in browser dev tools (localStorage)
- The Supabase anon key in the client bundle gives read access to all families' player data (see Security Review below)

**Difficulty:** Medium

**Suggested Fix:** At minimum, hash PINs before storage/sync. For a family app with 3-digit PINs, even a simple SHA-256 hash would be better than plaintext. Better yet, keep PINs local-only (don't sync them) since they protect local device access, not remote access.

---

## Important Fixes (Should Do)

### 4. Flashcards useEffect Missing `goNext` Dependency (Confirmed -- Medium Priority)

**QA Finding Verified: YES**

**File:** `src/views/Flashcards.jsx`, lines 64-74

```javascript
useEffect(() => {
  if (!autoPlay || !card) return;
  timerRef.current = setTimeout(() => {
    if (!flipped) {
      setFlipped(true);
    } else {
      goNext();  // <-- called but not in deps
    }
  }, speed);
  return () => clearTimeout(timerRef.current);
}, [autoPlay, idx, flipped, speed]);  // <-- goNext missing
```

The `goNext` function is defined with `useCallback` at line 76 and depends on `[idx, cards.length, xpAwarded, onAddXp]`. When `xpAwarded` changes (every 5 cards), the `goNext` captured by the `useEffect` closure will be stale. This means the XP check on line 88 (`if (nextIdx % 5 === 0 && !xpAwarded.has(nextIdx))`) could use an outdated `xpAwarded` Set, potentially awarding double XP on autoPlay at card boundaries.

**Difficulty:** Easy

**Suggested Fix:** Add `goNext` to the dependency array:

```javascript
}, [autoPlay, idx, flipped, speed, goNext]);
```

---

### 5. StoryReader useEffect Missing Dependencies (Confirmed -- Medium Priority)

**QA Finding Verified: YES**

**File:** `src/views/StoryReader.jsx`

Three `useEffect` hooks have incomplete dependency arrays:

**Line 151-159** (record mode effect):
```javascript
useEffect(() => {
  if (mode === "record" && sr.transcript && !sr.listening) {
    setRecording(sr.transcript);
    if (!xpAwarded.has(`record-${pageIdx}`)) {
      onAddXp(10);  // onAddXp, xpAwarded, pageIdx not in deps
      ...
    }
  }
}, [sr.transcript, sr.listening, mode]);
// Missing: pageIdx, xpAwarded, onAddXp
```

**Line 161-168** (repeat-after-listen effect):
```javascript
useEffect(() => {
  if (mode === "repeat" && !isNarrating) {
    const t = setTimeout(() => {
      if (mode === "repeat") sr.start();  // sr.start not in deps
    }, 800);
    return () => clearTimeout(t);
  }
}, [isNarrating, mode]);
// Missing: sr.start (though sr is stable via hook)
```

**Line 170-178** (repeat mode transcript effect):
```javascript
useEffect(() => {
  if (mode === "repeat" && sr.transcript && !sr.listening) {
    setRecording(sr.transcript);
    if (!xpAwarded.has(`repeat-${pageIdx}`)) {
      onAddXp(8);  // onAddXp, xpAwarded, pageIdx not in deps
      ...
    }
  }
}, [sr.transcript, sr.listening, mode]);
// Missing: pageIdx, xpAwarded, onAddXp
```

The practical impact: if a user navigates to a new page while recording, `pageIdx` in the closure will be stale, and XP could be awarded against the wrong page key. Also, `onAddXp` and `xpAwarded` staleness could cause duplicate or missed XP awards.

**Difficulty:** Easy

**Suggested Fix:** Add the missing deps to each effect. For the XP-related effects, add `pageIdx`, `xpAwarded`, and `onAddXp`. Since `sr.start` comes from a stable `useCallback` in `useMic`, the middle effect is lower risk but should still include it for correctness.

---

### 6. Singular/Plural Grammar Bugs (Confirmed -- Low-Medium Priority)

**QA Finding Verified: YES**

Four locations display counts without proper singular/plural handling:

| File | Line | Current Text | Should Be |
|------|------|-------------|-----------|
| `src/views/Splash.jsx` | 47 | `{wordCount} words collected` | `{wordCount} word(s) collected` |
| `src/views/Home.jsx` | 345 | `${...length} words today` | `${...length} word(s) today` |
| `src/views/YearCollage.jsx` | 131 | `{allWords.length} reflections collected` | `{...} reflection(s) collected` |
| `src/views/YearCollage.jsx` | 322 | `{allWords.length} words` | `{...} word(s)` |

**Difficulty:** Easy

**Suggested Fix:** Create a utility helper:

```javascript
// src/utils/pluralize.js
export const pluralize = (count, singular, plural) =>
  count === 1 ? `${count} ${singular}` : `${count} ${plural || singular + 's'}`;
```

Then use it in each location:
- `pluralize(wordCount, 'word')` + ` collected`
- `pluralize(count, 'word')` + ` today`
- `pluralize(allWords.length, 'reflection')` + ` collected`
- `pluralize(allWords.length, 'word')`

---

### 7. No URL-Based Routing (Confirmed -- Medium Priority)

**QA Finding Verified: YES**

**File:** `src/App.jsx`, line 101: `const [view, setView] = useState("splash");`

The entire app navigation is driven by a single `view` state variable. There are no URL routes, so:
- Browser back/forward buttons do nothing
- Page refreshes lose the current view (returns to splash)
- Deep links to specific screens are impossible

While acceptable for a simple family PWA, this is the single largest UX gap. Users will instinctively press the browser back button and be confused when nothing happens.

**Difficulty:** Medium

**Suggested Fix:** Implement hash-based routing as a lightweight solution. This avoids adding React Router as a dependency:

```javascript
// In App.jsx, sync view with hash:
useEffect(() => {
  window.location.hash = view;
}, [view]);

useEffect(() => {
  const handler = () => {
    const hash = window.location.hash.replace('#', '') || 'splash';
    setView(hash);
  };
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}, []);
```

This is a minimal implementation. A more robust approach would use `window.history.pushState/popState` to avoid hash fragments in URLs.

---

## Nice-to-Have Improvements

### 8. Deprecated Meta Tag (Confirmed -- Low Priority)

**QA Finding Verified: YES**

**File:** `index.html`, line 9

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
```

This meta tag is deprecated. The browser console warns about it on every page load.

**Difficulty:** Easy (1-minute fix)

**Suggested Fix:** Replace with:
```html
<meta name="mobile-web-app-capable" content="yes" />
```

---

### 9. Family Name Possessive Display (Confirmed -- Low Priority)

**QA Finding Verified: YES, partially**

**File:** `src/views/Splash.jsx`, line 24:
```jsx
{familyName} family&rsquo;s language journey, one word at a time.
```

**File:** `src/views/Home.jsx`, line 117:
```jsx
{familyName} family&apos;s language journey
```

For a family name like "Garcias", this renders as "Garcias family's language journey" which is grammatically awkward. The QA report is correct. Note also that Splash uses `&rsquo;` (right single quote) while Home uses `&apos;` (straight apostrophe) -- these should be consistent.

**Difficulty:** Easy

**Suggested Fix:** Change to `The {familyName} Family's Language Journey` or `{familyName} Family Language Journey` (dropping the possessive). Also standardize to `&rsquo;` in both locations for typographic consistency.

---

### 10. Owner Code in Client Bundle (Confirmed -- Low Priority)

**QA Finding Verified: YES**

**File:** `src/data/families.js`, line 19:
```javascript
export const OWNER_CODE = "OWNER-2026";
```

This is visible in the JavaScript bundle to anyone who inspects the page source. For a family app this is low risk, but worth documenting.

**Difficulty:** N/A (architectural limitation of a client-side app)

**Note:** If this ever needs to be secure, it would need to be validated server-side (e.g., a Supabase RPC function). For the current use case, this is acceptable.

---

### 11. Font Preloading (QA Suggestion -- Low Priority)

The app uses four Google Fonts (Caveat, Patrick Hand, Indie Flower, Shadows Into Light) loaded via CSS `@import` or `<link>` tags. There are no `<link rel="preload">` hints in `index.html`, which can cause a Flash of Unstyled Text (FOUT) on first load.

**Difficulty:** Easy

**Suggested Fix:** Add to `index.html` `<head>`:
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" as="style" />
```
(Repeat for each font family used.)

---

### 12. Accessibility: Missing `lang` Attribute on Target Language Text (MISSED by QA partially -- Low Priority)

**File:** `src/views/StoryReader.jsx`, line 251-256

The story text is rendered without a `lang` attribute:
```jsx
<p ref={storyTextRef} className={`text-lg text-ink...`}>
  {page.text}
</p>
```

Screen readers default to the document's `lang="en"` (set in `index.html`), so Spanish/Japanese/Korean text will be mispronounced.

**Difficulty:** Easy

**Suggested Fix:**
```jsx
<p ref={storyTextRef} lang={langCode} className={...}>
```

This also applies to:
- `src/views/Drill.jsx` line 111 (drill question text)
- `src/views/Speak.jsx` line 58 (phrase text)
- `src/views/Flashcards.jsx` line 193 (card front text when showing target language)

---

### 13. Name Input Has No Max Length on Join Form (MISSED by QA -- Low Priority)

**File:** `src/views/Join.jsx`, line 55-59

```jsx
<input
  value={joinName}
  onChange={(e) => setJoinName(e.target.value)}
  placeholder="Write your name here..."
  className="..."
/>
```

There is no `maxLength` attribute on the name input. While the daily word input is limited to 20 characters (`Home.jsx` line 298), player names have no limit. Very long names will break UI layouts (avatar cards, admin panel, etc.).

**Difficulty:** Easy

**Suggested Fix:** Add `maxLength={30}` to the input, matching reasonable display limits.

---

### 14. Pronunciation Lab Awards XP Without Limit (MISSED by QA -- Low Priority)

**File:** `src/views/Speak.jsx`, lines 104-108

```jsx
<Button
  onClick={() => {
    setIdx((i) => i + 1);
    onAddXp(10);
  }}
  ...
>
  Next Phrase
</Button>
```

Unlike Flashcards (which tracks XP awards with a Set) and StoryReader (which tracks per-page XP), the Pronunciation Lab awards +10 XP every time "Next Phrase" is clicked, even for repeated phrases (since `idx` wraps via modulo on line 18). A user can farm unlimited XP by cycling through the same phrases.

**Difficulty:** Easy

**Suggested Fix:** Add XP tracking similar to Flashcards:

```javascript
const [xpAwarded, setXpAwarded] = useState(new Set());
// Then in the Next button handler:
if (!xpAwarded.has(idx)) {
  onAddXp(10);
  setXpAwarded(prev => new Set([...prev, idx]));
}
```

---

### 15. Drills Also Award XP Without Repeat Protection (MISSED by QA -- Low Priority)

**File:** `src/views/Drill.jsx`, line 40

```javascript
if (isCorrect) onAddXp(15);
```

Since drills wrap at `idx % drills.length` (line 23), a user who cycles through all drills and answers them again will receive XP again. There is no tracking of which drill questions have already awarded XP.

**Difficulty:** Easy

**Suggested Fix:** Same pattern as above -- add an `xpAwarded` Set tracking.

---

## QA Report Accuracy

**Overall Accuracy: High (8/9 findings confirmed)**

| QA Finding | Verified? | Notes |
|-----------|-----------|-------|
| 366-day year hardcoded | YES | All file/line references accurate |
| Singular/plural grammar | YES | All 4 instances confirmed |
| Deprecated meta tag | YES | Confirmed at `index.html` line 9 |
| No URL-based routing | YES | Confirmed -- entirely state-based |
| Family name possessive | YES | Confirmed in both files |
| Flashcards useEffect deps | YES | Missing `goNext` in dependency array |
| StoryReader useEffect deps | YES | Three effects with missing deps confirmed |
| Weekly XP reset during render | YES | Anti-pattern confirmed at lines 130-135 |
| Owner code in client bundle | YES | Confirmed at `families.js` line 19 |

**False Positives:** None. All findings were accurate.

**Missed Issues (found in this review):**

1. **PIN stored/synced in plain text** -- security concern
2. **Pronunciation Lab unlimited XP farming** -- game mechanic bug
3. **Drill XP re-farming on wrap** -- game mechanic bug
4. **Missing `lang` attribute on target-language text** -- accessibility
5. **No `maxLength` on name input in Join form** -- UI/validation
6. **Inconsistent apostrophe entities** (`&rsquo;` vs `&apos;`) -- typography
7. **`wordCount` useMemo depends on `view`** -- unusual dependency (see Code Quality Notes)
8. **`useKaraoke` sets `innerHTML` directly** -- potential XSS vector (see Security Review)

---

## Security Review

### Supabase Sync Security

**Architecture:** The app uses Supabase with the anon key in the client bundle (via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). This is standard for Supabase client-side apps and is not inherently insecure IF Row Level Security (RLS) policies are properly configured on the Supabase side.

**Potential Concerns:**

1. **No RLS verification visible in client code.** The client pushes and pulls data filtered by `familyCode`, but there is no evidence of server-side enforcement. Without RLS:
   - Any user with the anon key (visible in the bundle) could read ALL families' data
   - A user could modify another family's data by changing the `familyCode` in requests
   - PINs, player names, daily words, and XP are all exposed

   **Recommendation:** Verify that Supabase has RLS policies that restrict data access per family. Ideally, implement a lightweight auth mechanism (even anonymous auth per device/family) rather than relying solely on the anon key.

2. **PINs synced in plain text** (see Critical Fix #3 above). The `syncEngine.js` pushes `pin: p.pin || null` to the `players` table. Even with RLS, this is poor practice.

3. **No input sanitization before Supabase upserts.** The `pushFamilyData` function in `syncEngine.js` (lines 12-80) passes user-provided strings (family names, player names, daily words) directly to Supabase upserts without sanitization. Supabase/PostgreSQL parameterizes queries, so SQL injection is not a concern, but there is no protection against very long strings or special characters that could cause display issues.

4. **`useKaraoke.js` sets `innerHTML` directly** (`line 47: el.innerHTML = spanHTML`). The `spanHTML` is built from `pageText` which comes from the story data files. Since these are developer-controlled static data (not user input), this is currently safe. However, if story content were ever sourced from user input or an API, this would be an XSS vulnerability. Consider using `textContent` with DOM manipulation instead of `innerHTML`.

5. **Family codes are enumerable.** Since family codes are simple word pairs (MAPLE-TREE, RHYSS-FAM, BLUE-OCEAN), they could potentially be guessed. The app validates against a hardcoded list, so brute-forcing is limited, but the codes themselves are visible in the client bundle (`families.js`).

### localStorage Security

- Data isolation per family is properly implemented via `familyKey` prefixing
- No sensitive credentials are stored in localStorage (Supabase keys are in env vars)
- The migration utility (`migrateStorage.js`) correctly moves old unprefixed data

---

## Code Quality Notes

### Positive Observations

- **Clean component architecture.** Views, components, hooks, utils, and data are well-separated.
- **Consistent code style.** Naming conventions are uniform throughout.
- **Good offline-first design.** The `if (!supabase) return` guard pattern is used consistently.
- **Solid merge conflict resolution.** The `mergeState` function in `syncEngine.js` handles player merges intelligently (Math.max for XP/streak, union for collections).
- **Proper cleanup in hooks.** The `useSupabaseSync` hook uses `mountedRef` to prevent state updates after unmount. The `useKaraoke` hook properly cancels animation frames.

### Issues Noted

1. **`wordCount` useMemo has `view` as dependency** (`App.jsx` line 109):
   ```javascript
   const wordCount = useMemo(() => {
     try {
       const raw = localStorage.getItem(dailyWordsKey);
       return raw ? JSON.parse(raw).length : 0;
     } catch { return 0; }
   }, [dailyWordsKey, view]);
   ```
   Using `view` as a dependency to force re-computation on navigation is a code smell. The actual word count doesn't depend on which view is active. A cleaner approach would be to derive word count from the `dailyWords` state directly (which the `Home` component already reads via `useLocalStorage`).

2. **Duplicate `SEAL_COLORS` definition.** The array exists in both `src/data/constants.js` (line 29) and `src/components/ui/Avatar.jsx` (line 1). These should be unified to a single source.

3. **Duplicate `shuffle` function.** An identical Fisher-Yates shuffle is defined in both `src/views/Flashcards.jsx` (line 23) and `src/utils/getDrills.js` (line 11). Extract to a shared utility.

4. **Unused `speakSlow` function** in `StoryReader.jsx` (lines 23-32). This function is defined but never called (the comment says "kept as quick fallback if needed"). Dead code should be removed.

5. **Unused import in `Drill.jsx`:** `ForwardArrow` is imported from Icons (line 6) and used on line 200, which is fine. However, `useEffect` is imported (line 1) and used only for the mic transcript sync, which is correct. All imports verified as used.

6. **The `eslint-disable-line` comments** in `useLocalStorage.js` line 27 and `Gate.jsx` line 48 suppress exhaustive-deps warnings. The Gate.jsx one is intentional (run-once on mount), but the useLocalStorage one suppresses the `initialValue` dependency which could cause bugs if `initialValue` is a new object reference on each render. Since the hook only uses `initialValue` as a fallback, this is acceptable but should be documented.

7. **`App.jsx` line 302 has a side effect in render:** `if (!effectiveUser) return setView("home") || null;` calls `setView` during render. This is the same class of issue as the weekly XP reset. It appears on lines 302, 319, 329, 339, 352, and 363. These should be guarded with `useEffect` or the routing logic should prevent these states.

---

## Recommended Fix Order

1. **Side effects during render** (`App.jsx` lines 130-135, 302, 319, 329, 339, 352, 363) -- These can cause subtle bugs in React 19 StrictMode and double-fire state updates. Fix first because they affect the foundation of the app.

2. **Hardcoded 366-day year** -- Visible to every user every day. Create a utility function and replace all 10+ instances.

3. **Flashcards useEffect missing dependency** (`Flashcards.jsx` line 74) -- Can cause double XP awards during autoplay.

4. **StoryReader useEffect missing dependencies** (`StoryReader.jsx` lines 159, 168, 178) -- Can cause stale XP tracking across page changes.

5. **Singular/plural grammar bugs** (4 instances) -- Quick fix with broad user-facing impact.

6. **PIN plain-text sync** (`syncEngine.js` line 48) -- Security improvement. Either hash or stop syncing PINs.

7. **Pronunciation Lab unlimited XP** (`Speak.jsx` lines 104-108) -- Game balance fix.

8. **Deprecated meta tag** (`index.html` line 9) -- 1-minute fix, eliminates console warning.

9. **Family name possessive grammar** (`Splash.jsx` line 24, `Home.jsx` line 117) -- Quick text fix.

10. **Name input max length** (`Join.jsx` line 57) -- Add `maxLength` attribute.

11. **URL-based routing** (`App.jsx`) -- Largest effort, biggest UX improvement. Best tackled as a separate feature branch.

12. **Accessibility `lang` attributes** (`StoryReader.jsx`, `Drill.jsx`, `Speak.jsx`, `Flashcards.jsx`) -- Easy additions, meaningful for screen reader users.

13. **Code cleanup** -- Remove duplicate `SEAL_COLORS`, extract shared `shuffle`, remove dead `speakSlow` function.

14. **Font preloading** -- Add `<link rel="preload">` tags in `index.html`.

15. **Supabase RLS audit** -- Verify server-side security policies (requires access to Supabase dashboard, not fixable from client code alone).
