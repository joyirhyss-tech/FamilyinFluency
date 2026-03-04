import { useState, useRef, useEffect } from "react";
import { LANGS, PATHS } from "../data/constants";
import { getDrills } from "../utils/getDrills";
import { checkAnswer } from "../utils/normalize";
import { useMic } from "../hooks/useMic";
import { CheckIcon, CrossIcon, BackArrow, ForwardArrow, DrillIcon, SpeakerIcon } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { MicBtn } from "../components/ui/MicBtn";
import { SpeakerBtn } from "../components/ui/SpeakerBtn";

export function Drill({ user, onBack, onAddXp }) {
  const [drills] = useState(() => getDrills(user.lang, user.paths, user.diff));
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null); // "correct" | "wrong" | null
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(new Set());
  const inputRef = useRef(null);
  const langCode = LANGS[user.lang]?.code || "es-MX";
  const sr = useMic(langCode);

  const drill = drills[idx % Math.max(drills.length, 1)];

  // Sync mic transcript to answer field when mic stops
  useEffect(() => {
    if (sr.transcript && !sr.listening) {
      setAnswer(sr.transcript);
    }
  }, [sr.transcript, sr.listening]);

  const check = () => {
    if (!answer.trim() || !drill) return;
    const isCorrect = checkAnswer(answer, drill.a, drill.alts || []);
    setResult(isCorrect ? "correct" : "wrong");
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    if (isCorrect && !xpAwarded.has(idx)) {
      onAddXp(15);
      setXpAwarded((prev) => new Set([...prev, idx]));
    }
  };

  const next = () => {
    setIdx((i) => i + 1);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  if (drills.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
        <Card className="p-6 text-center max-w-sm">
          <p className="text-ink font-bold mb-2">No drills available</p>
          <p className="text-pencil text-sm mb-4">
            No drills found for your level and learning paths.
          </p>
          <Button onClick={onBack}>Go Back</Button>
        </Card>
      </div>
    );
  }

  // Drill type label
  const typeLabel = {
    translate: "Translate",
    fill_blank: "Fill in the blank",
    scenario: "Scenario",
    conjugation: "Conjugation",
    error_correction: "Find the error",
    reorder: "Reorder",
  }[drill?.type] || "Translate";

  return (
    <div className="min-h-screen bg-paper flex flex-col notebook-paper">
      {/* Header bar */}
      <div className="bg-green-check px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-paper/80 hover:text-paper stamp-btn">
          <BackArrow size={18} />
        </button>
        <div className="text-paper flex-1">
          <p className="font-bold text-sm flex items-center gap-1.5">
            <DrillIcon size={14} /> Speed Drills
          </p>
          <p className="text-xs opacity-80 font-[family-name:var(--font-typed)]">
            {LANGS[user.lang]?.name} / {user.paths.map((p) => PATHS[p]?.name).join(", ")}
          </p>
        </div>
        <div className="text-paper text-right text-xs font-[family-name:var(--font-typed)]">
          <p className="font-bold">
            {score.correct} / {score.total}
          </p>
          <p className="opacity-70">correct</p>
        </div>
      </div>

      {/* Drill content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <Card className="p-6 w-full max-w-sm text-center fade-in">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
              #{(idx % drills.length) + 1} of {drills.length}
            </p>
            <span className="text-xs text-pencil bg-paper-dark px-2 py-0.5 rounded-sm border border-paper-line">
              {typeLabel}
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink mb-5 leading-snug">
            {drill?.q}
          </h3>

          {!result && (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  ref={inputRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="Your answer..."
                  className="flex-1 px-4 py-3 bg-paper-dark border-2 border-paper-line rounded-sm text-sm focus:border-ink outline-none text-center font-[family-name:var(--font-typed)]"
                  autoFocus
                />
                <MicBtn
                  listening={sr.listening}
                  onStart={sr.start}
                  onStop={sr.stop}
                  supported={sr.supported}
                  size={48}
                />
              </div>

              {sr.listening && sr.transcript && (
                <p className="text-xs text-blue-ink mb-2 italic">
                  Heard: {sr.transcript}
                </p>
              )}

              {showHint && drill?.hint && (
                <div className="sticky-note mb-3 text-sm">
                  {drill.hint}
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <Button
                  onClick={check}
                  disabled={!answer.trim()}
                  variant="success"
                  size="md"
                >
                  <CheckIcon size={14} /> Check
                </Button>
                {!showHint && drill?.hint && (
                  <Button
                    onClick={() => setShowHint(true)}
                    variant="ghost"
                    size="md"
                  >
                    Hint
                  </Button>
                )}
              </div>
            </>
          )}

          {result && (
            <div className="mt-2 fade-in">
              <div
                className={`w-14 h-14 mx-auto mb-2 rounded-sm flex items-center justify-center stamp-appear ${
                  result === "correct" ? "bg-green-check/10" : "bg-red-pen/10"
                }`}
              >
                {result === "correct" ? (
                  <CheckIcon size={28} className="text-green-check" />
                ) : (
                  <CrossIcon size={28} className="text-red-pen" />
                )}
              </div>

              <p
                className={`font-[family-name:var(--font-hand)] font-bold text-xl ${
                  result === "correct" ? "text-green-check" : "text-red-pen"
                }`}
              >
                {result === "correct" ? "Correct! +15 XP" : "Not quite"}
              </p>

              <div className="flex items-center justify-center gap-2 my-3 bg-paper-dark rounded-sm p-3 border border-paper-line">
                <p className="text-sm text-ink font-bold font-[family-name:var(--font-typed)]" lang={langCode}>
                  {drill?.a}
                </p>
                {drill?.audio && (
                  <SpeakerBtn text={drill.audio} langCode={langCode} />
                )}
              </div>

              <Button onClick={next} variant="primary" size="md">
                Next <ForwardArrow size={14} />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
