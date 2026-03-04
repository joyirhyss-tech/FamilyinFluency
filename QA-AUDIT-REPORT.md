# Family inFluency -- QA Audit Report
**Date:** 2026-03-04
**Tester:** Automated QA Agent (Claude)
**App Version:** Dev (localhost:5173)
**Tech Stack:** React 19 / Vite 7 / Tailwind CSS 4 / Supabase sync

---

## Executive Summary

Family inFluency is a polished, well-designed family language learning app with a charming notebook/stationery visual theme. Core features -- player creation, drills, pronunciation, flashcards, story reading, daily words, and year collage -- all function correctly. The app is mobile-responsive and has zero JavaScript console errors. The primary issues found are: (1) a hardcoded 366-day year that is incorrect for 2026, (2) several singular/plural grammar bugs in UI strings, (3) no URL-based routing (browser back/forward does nothing), and (4) missing font preloading causing potential FOUT. No data-loss bugs or crashes were found.

---

## Test Results

### PASSING

- **Gate / Invite Code Entry**: Accepts valid family codes (MAPLE-TREE, RHYSS-FAM, BLUE-OCEAN), rejects invalid codes with clear error message and shake animation. Auto-uppercases input.
- **Owner Dashboard**: OWNER-2026 code correctly opens the owner dashboard showing all 3 registered families with member counts, magic links, copy functionality, and "Enter Family" buttons.
- **Magic Link / Deep Linking**: `?join=MAPLE-TREE` URL parameter auto-activates the family and cleans the URL afterward.
- **Player Creation (Join Flow)**: Name input, multi-language selection (Spanish/Japanese/Korean), learning goal selection (5 paths), per-language difficulty levels (A1-C2), and 3-digit PIN all work correctly. "Start My Year" button properly validates all required fields before enabling.
- **Home Hub**: Displays all family members with avatars, language badges, difficulty levels, XP bars, streak counts, lock icons for PIN-protected players, and daily words. Grid layout adapts (1-col for <3 members, 2-col for 3+).
- **PIN Authentication**: Clicking a locked player shows a 3-digit PIN overlay with auto-advance between fields, backspace navigation, error shake on wrong PIN, and cancel button. Correct PIN navigates to dashboard.
- **Dashboard**: Shows player profile (name, avatar, language/difficulty, learning paths), 5 activity cards (Speed Drills, Pronunciation, Story Library, Flashcards, Family inFluency), stats (Streak, XP, Level), and XP progress bar to next level.
- **Language Switcher**: For multi-language players, a tab bar appears in the dashboard header. Switching languages changes the displayed difficulty and filters drill/story/flashcard content appropriately.
- **Speed Drills**: Loads correctly for Spanish (15 drills) and Japanese (10 drills). Shows question, answer input, mic button, Check button, and Hint button. Correct answers show green check + "+15 XP". Wrong answers show red X + "Not quite" with the correct answer. Score counter tracks correctly. Speaker button plays audio for correct answers.
- **Pronunciation Lab**: Displays phrase in target language with English translation. "Listen to Pronunciation" button uses TTS. Microphone button toggles recording. Phrases advance with "Next Phrase" button and award +10 XP each.
- **Story Library**: Shows available stories in a 2x2 grid with custom SVG book cover illustrations, titles in target language and English, difficulty badges, and page counts. "How Reading Works" explanation section present.
- **Story Reader**: Full-featured reader with page-by-page navigation, dot progress indicator, bookmark ribbon decoration, drop cap on first page, expandable Translation section (yellow sticky note style), expandable Vocabulary section with speaker icons, and three audio modes (Listen, Repeat, Read Aloud). XP awarded for listening (+5) and recording (+10). Page flip animations work. "Finish Story" button on last page, with story-complete celebration overlay.
- **Flashcards**: 177 vocab words for Spanish extracted from stories. Index card visual with 3D flip animation, front/back labels, source story reference. Speed control (2s/3s/5s/8s), Show First direction toggle (target language / English), Auto Play mode, prev/next navigation. XP awarded every 5 cards.
- **Daily Word Feature**: Per-player word input on Home hub with daily prompts. Words are stored by date and player. Past words shown below input. Submitted word appears on player card in quotes. Max 20 character limit enforced.
- **Year of Words Collage**: Renders a downloadable collage with family name, year range, words organized by month with decorative stars, member legend with color-coded avatars and word counts, and decorative washi tape elements. Download uses html2canvas. Empty state shows placeholder text.
- **Admin Panel**: Family name editing with Save/Cancel. Per-player editing (name, streak, language levels, PIN). Confirm dialog for player deletion. First player (Admin) cannot be deleted. "Switch Family" option to sign out and re-enter gate.
- **Family Switching**: Admin -> Switch correctly returns to Gate screen, clearing active family state.
- **Supabase Sync**: Architecture is solid -- pushes on local changes (debounced 2s), pulls every 60s and on tab focus/reconnect. Gracefully handles no Supabase config (offline-first). Merge conflict resolution implemented.
- **localStorage Namespacing**: All data is prefixed with family code (e.g., `fluency-MAPLE-TREE-players`). Family switching correctly isolates data.
- **Mobile Responsive**: Tested at 375x812 (iPhone). All screens render properly. Touch targets are adequately sized. Text remains readable.
- **Zero Console Errors**: No JavaScript errors in console. Only a deprecation warning for `apple-mobile-web-app-capable` meta tag and standard React DevTools notice.
- **XP System**: XP awards correctly (+15 for drills, +10 for pronunciation/recording, +8 for repeat, +5 for listening/flashcards). Level calculation: floor(xp/400) + 1. Progress bar shows percentage to next level.
- **Streak System**: Correctly initializes to 1 on first activity. Uses toDateString() for day comparison. Resets to 1 if a day is skipped.

### WARNINGS

1. **Hardcoded 366-Day Year (Medium Priority)**
   - **Location:** `App.jsx` line 94, `Splash.jsx` line 6/36, `Home.jsx` line 345/354/361, `YearCollage.jsx` line 38/322
   - **Issue:** The year timer is hardcoded to 366 days everywhere. The year 2026 has 365 days (not a leap year). This causes "Day 0 of 366 - 366 days to go" to display, which will be off by one day for the entire year. The collage also says "366 days".
   - **Fix:** Calculate based on whether the year span includes a Feb 29, or simply use 365 as default.

2. **Singular/Plural Grammar Bugs (Low-Medium Priority)**
   - **"1 words collected"** on Splash screen (should be "1 word collected")
   - **"1 words today"** on Home "Year of Words" card (should be "1 word today")
   - **"1 reflections collected"** on Year Collage header (should be "1 reflection collected")
   - **"1 words - 366 days"** in collage divider (should be "1 word")
   - **Location:** These are in `Splash.jsx` line 48, `Home.jsx` line 345, `YearCollage.jsx` lines 132 and 322.

3. **Deprecated Meta Tag (Low Priority)**
   - **Location:** `index.html` line 9
   - **Issue:** `<meta name="apple-mobile-web-app-capable" content="yes">` is deprecated. Browser console warns about this on every load.
   - **Fix:** Replace with `<meta name="mobile-web-app-capable" content="yes">`.

4. **No URL-Based Routing (Medium Priority)**
   - **Issue:** The app uses React state (`view` variable in App.jsx) for all navigation. There are no URL routes. This means:
     - Browser back/forward buttons do nothing useful
     - Users cannot bookmark or share links to specific screens
     - Page refreshes always return to the splash screen (family is preserved via localStorage, but active player/view is lost)
   - **Impact:** Standard for a simple PWA, but could frustrate users who expect browser navigation to work.

5. **Family Name Possessive Display (Low Priority)**
   - **Location:** `Splash.jsx` line 24, `Home.jsx` line 117
   - **Issue:** Shows "Garcias family's language journey" -- this is grammatically awkward. Should be "The Garcias' family language journey" or "Garcia family's language journey" (depending on intent). The possessive is applied to the family name rather than treating it as a proper name.

6. **Flashcards useEffect Missing Dependencies (Low Priority)**
   - **Location:** `Flashcards.jsx` line 74
   - **Issue:** The autoPlay useEffect references `goNext` but it's defined with `useCallback` which has `idx` in deps. The effect lists `[autoPlay, idx, flipped, speed]` but does not include `goNext`. This could potentially cause stale closures in edge cases.

7. **StoryReader useEffect Missing Dependencies (Low Priority)**
   - **Location:** `StoryReader.jsx` lines 159, 168, 178
   - **Issue:** Several useEffects reference variables like `pageIdx`, `mode`, `onAddXp`, `xpAwarded` without listing them in dependency arrays. React strict mode may warn about this.

8. **Weekly XP Reset Called During Render (Low Priority)**
   - **Location:** `App.jsx` lines 130-135
   - **Issue:** `shouldResetWeeklyXp` is called directly in the render body (not in a useEffect). While it works due to the guard conditions, this is an anti-pattern in React -- side effects (setWeekStart, setPlayers) should not be called during render. Could cause double-invocation issues in StrictMode.

9. **Owner Code Exposed in Client Bundle (Low Priority)**
   - **Location:** `data/families.js` line 19
   - **Issue:** `OWNER_CODE = "OWNER-2026"` is hardcoded in client-side JavaScript. Anyone can find it by viewing page source or bundle. This is acceptable for a family app but worth noting for security-conscious users.

### FAILURES

1. **No Critical Failures Found**
   - All screens load and function correctly.
   - No JavaScript errors.
   - No data loss scenarios encountered.
   - No crashes or infinite loops.

### SUGGESTIONS

1. **Add URL Routing**
   - Implement React Router or a simple hash-based router so browser back/forward work, and deep links to specific views are possible (e.g., `#/dashboard`, `#/drill`).

2. **Pluralization Helper**
   - Create a simple utility function like `pluralize(count, singular, plural)` and use it for all count displays to fix the grammar bugs systematically.

3. **Dynamic Year Calculation**
   - Replace hardcoded `366` with a computed value: `const daysInYear = isLeapYear(startYear) ? 366 : 365;` or calculate the actual number of days between start and end dates.

4. **Font Preloading**
   - Consider adding `<link rel="preload">` tags for the handwriting fonts (Caveat, Patrick Hand, Indie Flower, Shadows Into Light) to prevent Flash of Unstyled Text on first load.

5. **Add Loading/Error States for Supabase Sync**
   - The `syncStatus` is tracked but never displayed in the UI. Consider adding a subtle sync indicator (e.g., a small dot or icon in the header) so users know when their data is syncing.

6. **Empty Drill State for Korean**
   - Korean drills and stories exist but were not tested. Verify content completeness for all three languages at all difficulty levels.

7. **Keyboard Navigation**
   - Player cards have `role="button"` and `tabIndex={0}` with Enter key support -- good. However, the PIN overlay inputs could benefit from Escape key to cancel.

8. **Name Input Validation**
   - The Join form accepts any character for names. Consider adding a max length (currently unlimited in the input, though display truncation exists) and basic sanitization.

9. **Accessibility**
   - Story reader page text has no `lang` attribute set, which would help screen readers pronounce the target language correctly. Consider adding `lang="es"` / `lang="ja"` / `lang="ko"` to story text elements.

10. **PWA Manifest**
    - The app has mobile meta tags but no `manifest.json` for full PWA support (installability, offline caching). Given the target audience (families), installability on mobile would be valuable.

---

## Detailed Test Log

### Screen 1: Gate (Invite Code Entry)
- **URL:** `http://localhost:5173/`
- **Status:** PASS
- Loads with logo, "Family inFluency" title, subtitle, wax seal decoration
- Input auto-focuses, auto-uppercases text
- "Unlock" button disabled when input is empty, enables on input
- Valid code "MAPLE-TREE" -> activates Garcias family splash
- Invalid code "INVALID-CODE" -> red border, "Hmm, that code wasn't recognized"
- Owner code "OWNER-2026" -> opens Owner Dashboard
- Placeholder text shows "MAPLE-TREE" as hint

### Screen 2: Owner Dashboard
- **Status:** PASS
- Shows 3 families: Rhyss (owner, "You" badge), Garcias, Johnsons
- Each card shows code, member count (/10), magic link URL
- "Copy Link" and "Enter Family" buttons functional
- "Sign Out" returns to Gate
- Member counts update correctly (Garcias showed 1/10 after player creation)

### Screen 3: Splash Screen (Post-Unlock)
- **Status:** PASS (with warnings)
- Shows family name, year progress, word count, action buttons
- "Get Started" button (when no players) / "Open Notebook" + "Add Family Member" (when players exist)
- "View Year Collage" link appears when words > 0
- Member count displayed ("1 of 10 members joined")
- Language indicators (Espanol, Nihongo, Hangugeo) at bottom
- **Warning:** "1 words collected" grammar bug
- **Warning:** "Day 0 of 366" - 366 is wrong for 2026

### Screen 4: Join / Player Creation
- **Status:** PASS
- "Be inFluently" heading, member count
- Name input (free text)
- Language selection: 3 options (Spanish, Japanese, Korean), multi-select with checkmarks
- Learning Goals: 5 options, multi-select with tag-style buttons
- Starting Level: per-language 6-level selector (Starter through Fluent), dynamically adds/removes language sections
- Secret Key: 3-digit PIN with auto-advance, backspace navigation
- "Start My Year" enables only when all requirements met
- Back button returns to splash/home appropriately

### Screen 5: Home Hub
- **Status:** PASS (with warnings)
- Dark header with family name, settings gear, "+ Member" button
- Family section with player cards showing avatar, name, lock icon, language/level, daily word, XP bar, streak
- Daily word journal section with rotating prompts, per-player input, past words
- "Year of Words" card with day counter and progress bar
- "inFluency State" shows players who completed a goal today with flame badges
- **Warning:** "1 words today" grammar bug
- Player cards are clickable with proper hover/press feedback

### Screen 6: PIN Unlock
- **Status:** PASS
- Overlay appears on player card click
- Shows avatar, name, 3 PIN inputs
- Auto-advance on digit entry, backspace navigation
- Wrong PIN: red border, shake animation, "Try again" message, auto-refocus
- Correct PIN: navigates to dashboard
- Cancel button dismisses overlay

### Screen 7: Dashboard
- **Status:** PASS
- Player profile header (avatar, name, daily word quote, language/difficulty, path tags)
- Wax seal with level number
- Language switcher (when player has multiple languages)
- 5 activity cards in 2x2 + full-width grid layout
- Stats section (Streak, XP, Level) with icons
- "Progress to Lv[N+1]" with percentage and bar
- "Hub" back button returns to Home

### Screen 8: Speed Drills
- **Status:** PASS
- Green header bar with progress score
- 15 drills for Spanish / 10 for Japanese (content varies by language and paths)
- Question display with type label (Translate, Fill in the blank, etc.)
- Answer input + microphone button + Check button + Hint button
- Correct: green check, "+15 XP", speaker for correct answer, Next button
- Wrong: red X, "Not quite", shows correct answer, Next button
- Drill index wraps (cycles through drills)

### Screen 9: Pronunciation Lab
- **Status:** PASS
- Phrase display in target language with English translation
- "Listen to Pronunciation" button (blue, uses TTS)
- Microphone record button with "Tap to record yourself" / "Listening... speak now!" states
- "Next Phrase" button (green, awards +10 XP)
- Phrase counter (e.g., "Phrase 1 of 12")

### Screen 10: Story Library
- **Status:** PASS
- Story grid with custom SVG illustrations (different animal for each story)
- Story titles in target language and English
- Difficulty badges (A1, A1-A2, A2)
- Page count per story
- "How Reading Works" instructional section

### Screen 11: Story Reader
- **Status:** PASS
- Header with story title, difficulty badge, page counter, progress dots
- Book-style page with drop cap on first page, bookmark ribbon
- Expandable Translation (yellow sticky note style)
- Expandable Vocabulary with word list and speaker icons
- Listen/Repeat/Read Aloud controls
- Page navigation (Prev/Next with flip animation)
- "Finish Story" on last page with celebration overlay
- Karaoke highlighting during narration
- XP awards for listening and recording

### Screen 12: Flashcards
- **Status:** PASS
- Index card visual with binder holes, 3D flip animation
- Front: target language word with source story reference
- Back: English translation
- "Hear it" button for TTS
- Speed control (2s/3s/5s/8s)
- Direction toggle (target language first / English first)
- Auto Play mode
- Prev/Next navigation
- Progress bar and percentage
- XP awarded every 5 cards

### Screen 13: Year Collage
- **Status:** PASS (with warnings)
- Header with word count and Download button
- Collage with family name, year range, words organized by month
- Word cloud with varying sizes (based on frequency), fonts, colors (per player), and rotations
- Member legend with avatars, names, and word counts
- "Download Collage" button uses html2canvas
- Decorative washi tape elements
- "Year Complete" stamp (conditional)
- **Warning:** "1 reflections collected" grammar bug
- **Warning:** "1 words - 366 days" grammar bug

### Screen 14: Admin Panel
- **Status:** PASS
- Family name editing with inline input, Save/Cancel
- Player cards with Edit button
- Edit mode: name, streak (number input), per-language level selectors, PIN editor
- Delete confirmation with "Remove" (red) and Cancel buttons
- First player (Admin) has no Remove button
- "Switch Family" card with sign-out functionality

---

## Console Errors

**Zero JavaScript errors found.**

Console output during testing:
1. `[INFO] Download the React DevTools for a better development experience` -- standard React dev message
2. `[WARNING] <meta name="apple-mobile-web-app-capable" content="yes"> is deprecated` -- fix by updating to `mobile-web-app-capable`

No Supabase sync errors observed (sync is configured and operational).

---

## Sync Verification

- **Supabase client:** Configured via `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Sync behavior:** Push on local changes (2s debounce), pull every 60s, on tab focus, and on reconnect
- **Offline resilience:** App gracefully handles missing Supabase config -- `supabase` exports `null`, and all sync code guards with `if (!supabase) return`
- **Data isolation:** localStorage keys are namespaced per family code (e.g., `fluency-MAPLE-TREE-players`)
- **Merge strategy:** `syncEngine.js` implements conflict resolution for remote vs. local state
- **Status tracking:** `syncStatus` state is maintained (`idle`/`pushing`/`pulling`/`error`/`offline`) but not displayed in the UI

---

## Summary of Issues by Priority

| Priority | Issue | Location |
|----------|-------|----------|
| Medium | 366-day year hardcoded (2026 = 365 days) | App.jsx, Splash.jsx, Home.jsx, YearCollage.jsx |
| Medium | No URL-based routing (browser nav broken) | App.jsx (architecture) |
| Low-Med | Singular/plural grammar bugs (4 instances) | Splash.jsx, Home.jsx, YearCollage.jsx |
| Low | Deprecated meta tag warning | index.html line 9 |
| Low | Family name possessive grammar | Splash.jsx, Home.jsx |
| Low | useEffect dependency warnings | Flashcards.jsx, StoryReader.jsx |
| Low | Side effects during render | App.jsx lines 130-135 |
| Low | Owner code in client bundle | families.js line 19 |
