import { LANGS, PATHS, DIFFICULTY, DIFFICULTY_SHORT, YEAR_DAYS } from "../data/constants";
import { getLevelProgress } from "../utils/xp";
import { FlameIcon, PlusIcon, BackArrow, SettingsIcon } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { useState, useRef } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const HAND_FONTS = ["hand-caveat", "hand-patrick", "hand-indie", "hand-shadows"];
const PROMPTS = [
  "How did practice feel?",
  "One word for today?",
  "What are you learning?",
  "Describe your mood",
  "What surprised you?",
  "How do you feel right now?",
  "One word about your week",
];

// Deterministic daily prompt based on date
function getDailyPrompt() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return PROMPTS[seed % PROMPTS.length];
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function Home({
  familyName,
  players,
  dailyWordsKey,
  yearProgress,
  onSelectPlayer,
  onAddPlayer,
  onBack,
  onAdmin,
  onCollage,
}) {
  const [dailyWords, setDailyWords] = useLocalStorage(dailyWordsKey, []);
  const [wordInputs, setWordInputs] = useState({}); // { playerId: text }
  const [unlocking, setUnlocking] = useState(null); // player index being unlocked
  const [pinInput, setPinInput] = useState(["", "", ""]);
  const [pinError, setPinError] = useState(false);
  const pinRefs = [useRef(null), useRef(null), useRef(null)];
  const prompt = getDailyPrompt();
  const today = getToday();

  const handlePinDigit = (idx, val) => {
    const digit = val.replace(/\D/g, "").slice(0, 1);
    const next = [...pinInput];
    next[idx] = digit;
    setPinInput(next);
    setPinError(false);

    if (digit && idx < 2) {
      pinRefs[idx + 1].current?.focus();
    }

    // Auto-submit when all 3 digits entered
    if (digit && idx === 2 && next[0] && next[1]) {
      const pin = next.join("");
      const ok = onSelectPlayer(unlocking, pin);
      if (!ok) {
        setPinError(true);
        setPinInput(["", "", ""]);
        setTimeout(() => pinRefs[0].current?.focus(), 100);
      }
    }
  };

  const handlePinBackspace = (idx, e) => {
    if (e.key === "Backspace" && !pinInput[idx] && idx > 0) {
      pinRefs[idx - 1].current?.focus();
    }
  };

  const openPlayer = (i) => {
    const p = players[i];
    if (p.pin) {
      // Has PIN — show unlock UI
      setUnlocking(i);
      setPinInput(["", "", ""]);
      setPinError(false);
      setTimeout(() => pinRefs[0].current?.focus(), 50);
    } else {
      // Legacy player without PIN — go straight in
      onSelectPlayer(i, null);
    }
  };

  const cancelUnlock = () => {
    setUnlocking(null);
    setPinInput(["", "", ""]);
    setPinError(false);
  };

  return (
    <div className="min-h-screen bg-paper page-enter">
      {/* Header */}
      <div className="bg-ink px-5 pt-6 pb-6 text-paper relative">
        <button
          onClick={onBack}
          className="text-pencil-light text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Back
        </button>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-3xl font-[family-name:var(--font-hand)] font-bold tracking-tight">
              Family inFluency
            </h1>
            <p className="text-pencil-light text-xs font-[family-name:var(--font-typed)]">
              The {familyName} family&#8217;s language journey
            </p>
          </div>
          <div className="flex items-center gap-2">
            {players.length > 0 && (
              <button
                onClick={onAdmin}
                className="text-pencil-light hover:text-paper stamp-btn p-1.5"
                title="Admin"
              >
                <SettingsIcon size={16} />
              </button>
            )}
            <Button
              onClick={onAddPlayer}
              variant="outline"
              size="xs"
              className="text-paper border-pencil-light hover:bg-pencil"
            >
              <PlusIcon size={12} /> Member
            </Button>
          </div>
        </div>
        <p className="text-pencil-light text-xs">{players.length} of 10 members</p>
      </div>

      <div className="px-4 -mt-3 pb-6 space-y-4">
        {/* Player Selection */}
        <Card>
          <h3 className="font-bold text-ink mb-3 font-[family-name:var(--font-hand)] text-lg">
            Family
          </h3>
          {players.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-pencil text-sm mb-3">No members yet</p>
              <Button onClick={onAddPlayer} size="sm">
                Add First Member
              </Button>
            </div>
          ) : (
            <div className={`grid gap-2.5 ${players.length >= 3 ? "grid-cols-2" : "grid-cols-1"}`}>
              {players.map((p, i) => {
                const fontClass = HAND_FONTS[i % HAND_FONTS.length];
                const todayWord = dailyWords.find((w) => w.playerId === p.id && w.date === today);
                const isUnlocking = unlocking === i;

                return (
                  <div
                    key={p.id}
                    className={`paper-card p-3 text-left relative overflow-hidden ${isUnlocking ? "" : "stamp-btn cursor-pointer"}`}
                    onClick={() => !isUnlocking && openPlayer(i)}
                    role={isUnlocking ? undefined : "button"}
                    tabIndex={isUnlocking ? undefined : 0}
                    onKeyDown={(e) => !isUnlocking && e.key === "Enter" && openPlayer(i)}
                  >
                    {/* PIN unlock overlay */}
                    {isUnlocking && (
                      <div className="absolute inset-0 bg-paper/95 z-10 flex flex-col items-center justify-center p-3 pin-unlock-enter">
                        <Avatar name={p.name} colorIdx={p.colorIdx} size={32} />
                        <p className="text-xs font-bold text-ink mt-1.5 mb-2">{p.name}</p>
                        <div className="flex gap-2 mb-1.5">
                          {[0, 1, 2].map((idx) => (
                            <input
                              key={idx}
                              ref={pinRefs[idx]}
                              type="tel"
                              inputMode="numeric"
                              maxLength={1}
                              value={pinInput[idx]}
                              onChange={(e) => handlePinDigit(idx, e.target.value)}
                              onKeyDown={(e) => handlePinBackspace(idx, e)}
                              className={`w-10 h-12 text-center text-xl font-[family-name:var(--font-hand)] font-bold bg-paper-dark border-2 rounded-sm outline-none transition-colors ${
                                pinError ? "border-red-pen shake" : "border-paper-line focus:border-ink"
                              }`}
                            />
                          ))}
                        </div>
                        {pinError && (
                          <p className="text-xs text-red-pen mb-1">Try again</p>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelUnlock(); }}
                          className="text-xs text-pencil-light hover:text-ink stamp-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 mb-2">
                      <Avatar name={p.name} colorIdx={p.colorIdx} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-ink text-sm truncate">
                            {p.name}
                          </p>
                          {p.pin && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-pencil-light flex-shrink-0">
                              <rect x="3" y="11" width="18" height="11" rx="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                          {(p.langs || [p.lang]).map(l => {
                            const diff = p.langDiffs?.[l] ?? p.diff;
                            return `${LANGS[l]?.name} ${DIFFICULTY_SHORT[diff]}`;
                          }).join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Daily word on tile */}
                    {todayWord && (
                      <p className={`${fontClass} text-lg text-ink/70 leading-tight mb-2 truncate`}>
                        &ldquo;{todayWord.word}&rdquo;
                      </p>
                    )}

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-wax-seal bg-paper-dark rounded-sm px-1.5 py-0.5 border border-paper-line">
                        Lv{p.level}
                      </span>
                      <div className="flex-1 h-1.5 bg-paper-dark rounded-sm overflow-hidden border border-paper-line">
                        <div
                          className="h-full bg-ink rounded-sm transition-all"
                          style={{ width: `${getLevelProgress(p.xp) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-pencil-light flex items-center gap-0.5">
                        <FlameIcon size={10} />
                        {p.streak}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Daily One Word Review */}
        {players.length > 0 && (
          <div className="journal-paper p-4">
            <p className="text-center text-pencil-light text-xs font-[family-name:var(--font-typed)] italic mb-3">
              {prompt}
            </p>
            <div className="journal-lines space-y-3">
              {players.map((p, i) => {
                const fontClass = HAND_FONTS[i % HAND_FONTS.length];
                const todayWord = dailyWords.find((w) => w.playerId === p.id && w.date === today);
                const pastWords = dailyWords
                  .filter((w) => w.playerId === p.id && w.date !== today)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 3);

                const submitWord = () => {
                  const text = (wordInputs[p.id] || "").trim();
                  if (!text) return;
                  setDailyWords((prev) => {
                    const filtered = prev.filter((w) => !(w.playerId === p.id && w.date === today));
                    return [...filtered, { playerId: p.id, word: text, date: today, prompt }];
                  });
                  setWordInputs((prev) => ({ ...prev, [p.id]: "" }));
                };

                return (
                  <div key={p.id}>
                    {i > 0 && <hr className="pencil-line" style={{ margin: "0 0 0.75rem 0", opacity: 0.2 }} />}
                    <div className="flex items-start gap-2.5">
                      <Avatar name={p.name} colorIdx={p.colorIdx} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-pencil mb-1">{p.name}</p>
                        {todayWord ? (
                          <p className={`${fontClass} text-2xl text-ink leading-tight`}>
                            {todayWord.word}
                          </p>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              value={wordInputs[p.id] || ""}
                              onChange={(e) => setWordInputs((prev) => ({ ...prev, [p.id]: e.target.value.slice(0, 20) }))}
                              onKeyDown={(e) => e.key === "Enter" && submitWord()}
                              placeholder="one word..."
                              maxLength={20}
                              className={`${fontClass} flex-1 text-xl bg-transparent border-b-2 border-paper-line focus:border-ink outline-none py-0.5 px-1 text-ink placeholder:text-pencil-light/50`}
                            />
                            <button
                              onClick={submitWord}
                              disabled={!(wordInputs[p.id] || "").trim()}
                              className="stamp-btn text-xs text-pencil-light disabled:opacity-30 px-2"
                            >
                              &#10003;
                            </button>
                          </div>
                        )}
                        {pastWords.length > 0 && (
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {pastWords.map((pw) => (
                              <span
                                key={pw.date}
                                className={`${fontClass} text-xs text-pencil-light/60`}
                              >
                                {pw.word}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Year of Words */}
        {players.length > 0 && yearProgress && (
          <Card onClick={onCollage} className="stamp-btn cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink font-[family-name:var(--font-hand)] text-lg">
                  {yearProgress.complete ? "\u2726 Year of Words \u2726" : "Year of Words"}
                </h3>
                <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
                  {yearProgress.complete
                    ? "Year complete \u2014 view your collage!"
                    : `Day ${yearProgress.elapsed} of ${YEAR_DAYS} \u00b7 ${dailyWords.filter((w) => w.date === today).length} ${dailyWords.filter((w) => w.date === today).length === 1 ? "word" : "words"} today`}
                </p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 rounded-sm bg-paper-dark border border-paper-line flex items-center justify-center">
                  <span className="font-[family-name:var(--font-hand)] text-lg font-bold text-ink">
                    {yearProgress.elapsed}
                  </span>
                </div>
                <span className="text-xs text-pencil-light">/{YEAR_DAYS}</span>
              </div>
            </div>
            {/* Mini progress bar */}
            <div className="mt-2 h-1.5 bg-paper-dark rounded-sm overflow-hidden border border-paper-line">
              <div
                className={`h-full rounded-sm transition-all ${yearProgress.complete ? "bg-highlight" : "bg-ink"}`}
                style={{ width: `${Math.min(100, (yearProgress.elapsed / YEAR_DAYS) * 100)}%` }}
              />
            </div>
          </Card>
        )}

        {/* InFluently State */}
        {players.length > 0 && (() => {
          const inState = players.filter((p) => {
            const hasWord = dailyWords.some((w) => w.playerId === p.id && w.date === today);
            const practicedToday = p.lastActiveDate === today;
            return hasWord || practicedToday;
          });
          return (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <FlameIcon size={16} className="text-highlight" />
                <h3 className="font-bold text-ink font-[family-name:var(--font-hand)] text-lg">
                  inFluency State
                </h3>
              </div>
              {inState.length === 0 ? (
                <p className="text-pencil-light text-sm text-center py-3 font-[family-name:var(--font-typed)]">
                  Complete a goal today to be in the inFluency State
                </p>
              ) : (
                <div className="flex flex-wrap gap-3 justify-center py-2">
                  {inState.map((p) => (
                    <div key={p.id} className="flex flex-col items-center gap-1">
                      <div className="relative">
                        <Avatar name={p.name} colorIdx={p.colorIdx} size={40} />
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-highlight rounded-full flex items-center justify-center text-xs border-2 border-paper">
                          <FlameIcon size={10} className="text-ink" />
                        </span>
                      </div>
                      <span className="text-xs font-bold text-ink">{p.name}</span>
                      <span className="text-xs text-pencil-light flex items-center gap-0.5">
                        <FlameIcon size={9} /> {p.streak}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })()}
      </div>
    </div>
  );
}
