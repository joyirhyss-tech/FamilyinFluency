import { useState, useEffect, useCallback, useRef } from "react";
import { LANGS } from "../data/constants";
import { SPANISH_STORIES } from "../data/stories-spanish";
import { JAPANESE_STORIES } from "../data/stories-japanese";
import { KOREAN_STORIES } from "../data/stories-korean";
import { BackArrow, ForwardArrow, SpeakerIcon } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { speakWord } from "../hooks/useSpeech";
import { shuffle } from "../utils/shuffle";

const ALL_STORIES = {
  spanish: SPANISH_STORIES,
  japanese: JAPANESE_STORIES,
  korean: KOREAN_STORIES,
};

const SPEEDS = [
  { label: "2s", value: 2000 },
  { label: "3s", value: 3000 },
  { label: "5s", value: 5000 },
  { label: "8s", value: 8000 },
];

function extractVocab(lang) {
  const stories = ALL_STORIES[lang] || [];
  const vocabMap = new Map();
  for (const story of stories) {
    for (const page of story.pages) {
      for (const v of page.vocab) {
        if (!vocabMap.has(v.word)) {
          vocabMap.set(v.word, { word: v.word, meaning: v.meaning, story: story.title });
        }
      }
    }
  }
  return shuffle([...vocabMap.values()]);
}

export function Flashcards({ user, onBack, onAddXp }) {
  const langCode = LANGS[user.lang]?.code || "es-MX";
  const langName = LANGS[user.lang]?.name || "Language";

  const [cards] = useState(() => extractVocab(user.lang));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState("target");
  const [speed, setSpeed] = useState(3000);
  const [autoPlay, setAutoPlay] = useState(false);
  const [slideAnim, setSlideAnim] = useState("");
  const [score, setScore] = useState({ seen: 0, total: cards.length });
  const timerRef = useRef(null);
  const goNextRef = useRef(null);
  const [xpAwarded, setXpAwarded] = useState(new Set());

  const card = cards[idx];

  // Keep ref in sync so the timer always calls the latest goNext
  useEffect(() => { goNextRef.current = goNext; });

  useEffect(() => {
    if (!autoPlay || !card) return;
    timerRef.current = setTimeout(() => {
      if (!flipped) {
        setFlipped(true);
      } else {
        goNextRef.current();
      }
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [autoPlay, idx, flipped, speed, card]);

  const goNext = useCallback(() => {
    if (idx >= cards.length - 1) {
      setAutoPlay(false);
      return;
    }
    setSlideAnim("index-slide-out");
    setTimeout(() => {
      setIdx((i) => i + 1);
      setFlipped(false);
      setSlideAnim("index-slide-in");
      setScore((s) => ({ ...s, seen: s.seen + 1 }));
      const nextIdx = idx + 1;
      if (nextIdx % 5 === 0 && !xpAwarded.has(nextIdx)) {
        onAddXp(5);
        setXpAwarded((prev) => new Set([...prev, nextIdx]));
      }
      setTimeout(() => setSlideAnim(""), 400);
    }, 250);
  }, [idx, cards.length, xpAwarded, onAddXp]);

  const goPrev = () => {
    if (idx <= 0) return;
    setSlideAnim("index-slide-out-prev");
    setTimeout(() => {
      setIdx((i) => i - 1);
      setFlipped(false);
      setSlideAnim("index-slide-in-prev");
      setTimeout(() => setSlideAnim(""), 400);
    }, 250);
  };

  const toggleFlip = () => setFlipped((f) => !f);

  const playWord = () => {
    if (card) speakWord(card.word, user.lang, langCode);
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="index-card p-6 text-center" style={{ width: 320 }}>
          <p className="text-ink font-bold mb-2">No vocabulary yet</p>
          <p className="text-pencil text-sm mb-4">
            Read some stories first to build your vocabulary.
          </p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const frontText = direction === "target" ? card.word : card.meaning;
  const backText = direction === "target" ? card.meaning : card.word;
  const frontLabel = direction === "target" ? langName : "English";
  const backLabel = direction === "target" ? "English" : langName;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#d4cbb5" }}>
      {/* Header - looks like a wooden desk / study area */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: "#6b5d4f" }}>
        <button
          onClick={() => { setAutoPlay(false); onBack(); }}
          className="text-white/60 text-sm mb-2 hover:text-white flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-[family-name:var(--font-hand)] font-bold text-white">
              Flashcards
            </h2>
            <p className="text-xs text-white/60 font-[family-name:var(--font-typed)]">
              {score.seen + 1} of {score.total} words
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-white font-[family-name:var(--font-typed)]">
              {Math.round(((score.seen) / score.total) * 100)}%
            </p>
            <p className="text-xs text-white/60">complete</p>
          </div>
        </div>
        {/* Progress - like a pencil line */}
        <div className="mt-2 h-0.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((score.seen + 1) / score.total) * 100}%`, backgroundColor: "#e8c84a" }}
          />
        </div>
      </div>

      {/* Card area - the "desk" */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* Card stack wrapper */}
        <div className={`index-card-stack w-full max-w-sm ${slideAnim}`}>
          <button
            onClick={toggleFlip}
            className="w-full stamp-btn focus:outline-none"
            style={{ perspective: "800px" }}
          >
            <div
              className="index-card-3d"
              style={{ transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)" }}
            >
              {/* FRONT face */}
              <div className="index-card index-card-front">
                {/* Binder holes */}
                <div className="index-holes">
                  <span /><span /><span />
                </div>
                {/* Corner number */}
                <span className="index-number">
                  {idx + 1}/{cards.length}
                </span>
                {/* Language label */}
                <span className="index-label">{frontLabel}</span>
                {/* Main word */}
                <p className="index-word" lang={direction === "target" ? langCode : undefined}>{frontText}</p>
                {/* Source story in small pencil text */}
                <p className="index-source">from: {card.story}</p>
                {/* Tap hint */}
                <p className="index-hint">tap to flip</p>
              </div>

              {/* BACK face */}
              <div className="index-card index-card-back">
                <div className="index-holes">
                  <span /><span /><span />
                </div>
                <span className="index-label" style={{ color: "#2c5f8a" }}>{backLabel}</span>
                <p className="index-word" style={{ color: "#2c5f8a" }} lang={direction === "english" ? langCode : undefined}>{backText}</p>
                <p className="index-hint">tap to flip back</p>
              </div>
            </div>
          </button>

          {/* Hear it button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={playWord}
              className="stamp-btn flex items-center gap-1.5 text-sm px-4 py-2 rounded-sm border-2"
              style={{
                backgroundColor: "#fffef0",
                borderColor: "#2c5f8a",
                color: "#2c5f8a",
                fontFamily: "var(--font-print)",
              }}
            >
              <SpeakerIcon size={14} /> Hear it
            </button>
          </div>
        </div>
      </div>

      {/* Controls - styled like a control strip on the desk */}
      <div className="px-4 pb-5 space-y-3">
        {/* Speed & direction on a card */}
        <div className="index-card p-3" style={{ minHeight: "auto" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E85C5C" }}>
              Speed
            </span>
            <div className="flex gap-1">
              {SPEEDS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSpeed(s.value)}
                  className="stamp-btn text-xs px-2 py-1 rounded-sm border"
                  style={speed === s.value ? {
                    backgroundColor: "#2d2a26",
                    color: "#fffef0",
                    borderColor: "#2d2a26",
                    fontWeight: "bold",
                  } : {
                    backgroundColor: "transparent",
                    color: "#6b6560",
                    borderColor: "#d2d2d2",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#E85C5C" }}>
              Show first
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setDirection("target")}
                className="stamp-btn text-xs px-2 py-1 rounded-sm border"
                style={direction === "target" ? {
                  backgroundColor: "#2d2a26",
                  color: "#fffef0",
                  borderColor: "#2d2a26",
                  fontWeight: "bold",
                } : {
                  backgroundColor: "transparent",
                  color: "#6b6560",
                  borderColor: "#d2d2d2",
                }}
              >
                {langName}
              </button>
              <button
                onClick={() => setDirection("english")}
                className="stamp-btn text-xs px-2 py-1 rounded-sm border"
                style={direction === "english" ? {
                  backgroundColor: "#2d2a26",
                  color: "#fffef0",
                  borderColor: "#2d2a26",
                  fontWeight: "bold",
                } : {
                  backgroundColor: "transparent",
                  color: "#6b6560",
                  borderColor: "#d2d2d2",
                }}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button onClick={goPrev} disabled={idx === 0} variant="outline" size="sm">
            <BackArrow size={12} />
          </Button>
          <Button
            onClick={() => setAutoPlay(!autoPlay)}
            variant={autoPlay ? "stamp" : "primary"}
            size="sm"
            className="flex-1"
          >
            {autoPlay ? "Pause" : "Auto Play"}
          </Button>
          <Button onClick={goNext} disabled={idx >= cards.length - 1} variant="outline" size="sm">
            <ForwardArrow size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
}
