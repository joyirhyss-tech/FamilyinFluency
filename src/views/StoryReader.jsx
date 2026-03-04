import { useState, useRef, useEffect, useCallback } from "react";
import { LANGS } from "../data/constants";
import { SPANISH_STORIES } from "../data/stories-spanish";
import { JAPANESE_STORIES } from "../data/stories-japanese";
import { KOREAN_STORIES } from "../data/stories-korean";
import { useMic } from "../hooks/useMic";
import { useKaraoke } from "../hooks/useKaraoke";
import {
  BackArrow, ForwardArrow, SpeakerIcon, MicIcon, BookIcon,
} from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { speakStoryPage, speakWord } from "../hooks/useSpeech";

const LEVEL_LABELS = ["A1", "A1-A2", "A2"];

const ALL_STORIES = {
  spanish: SPANISH_STORIES,
  japanese: JAPANESE_STORIES,
  korean: KOREAN_STORIES,
};

export function StoryReader({ user, storyId, onBack, onAddXp }) {
  const stories = ALL_STORIES[user.lang] || [];
  const story = stories.find((s) => s.id === storyId);
  const langCode = LANGS[user.lang]?.code || "es-MX";

  const [pageIdx, setPageIdx] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [mode, setMode] = useState("read");
  const [isNarrating, setIsNarrating] = useState(false);
  const [recording, setRecording] = useState(null);
  const [xpAwarded, setXpAwarded] = useState(new Set());
  const [flipDir, setFlipDir] = useState("next");
  const [flipKey, setFlipKey] = useState(0);

  const [showComplete, setShowComplete] = useState(false);

  const sr = useMic(langCode);
  const storyTextRef = useRef(null);
  const progressRef = useRef(null);
  const narrateRef = useRef(null);

  // Karaoke highlighting
  useKaraoke({
    textRef: storyTextRef,
    audioPlayer: narrateRef.current,
    pageText: story?.pages?.[pageIdx]?.text || "",
    coverColor: story?.coverColor,
    isFirstPage: pageIdx === 0,
    isNarrating,
    progressRef,
  });

  if (!story) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="book-page p-6 text-center" style={{ maxWidth: 340 }}>
          <p className="text-ink font-bold mb-2">Story not found</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const page = story.pages[pageIdx];
  const totalPages = story.pages.length;
  const isLastPage = pageIdx === totalPages - 1;
  const isFirstPage = pageIdx === 0;

  const goNext = () => {
    if (isLastPage) return;
    if (narrateRef.current) narrateRef.current.cancel();
    window.speechSynthesis?.cancel();
    setFlipDir("next");
    setFlipKey((k) => k + 1);
    setPageIdx((i) => i + 1);
    setShowTranslation(false);
    setShowVocab(false);
    setMode("read");
    setRecording(null);
    setIsNarrating(false);
  };

  const goPrev = () => {
    if (isFirstPage) return;
    if (narrateRef.current) narrateRef.current.cancel();
    window.speechSynthesis?.cancel();
    setFlipDir("prev");
    setFlipKey((k) => k + 1);
    setPageIdx((i) => i - 1);
    setShowTranslation(false);
    setShowVocab(false);
    setMode("read");
    setRecording(null);
    setIsNarrating(false);
  };

  const narrate = () => {
    if (!page) return;
    // Cancel any previous narration
    if (narrateRef.current) narrateRef.current.cancel();
    window.speechSynthesis?.cancel();

    setIsNarrating(true);

    // Use pre-generated audio (falls back to Web Speech API)
    const player = speakStoryPage(
      story.id, pageIdx + 1, user.lang, langCode, page.text
    );
    player.onend(() => {
      setIsNarrating(false);
      if (isLastPage) setShowComplete(true);
    });
    player.onerror(() => setIsNarrating(false));
    narrateRef.current = player;

    if (!xpAwarded.has(pageIdx)) {
      onAddXp(5);
      setXpAwarded((prev) => new Set([...prev, pageIdx]));
    }
  };

  const startRepeat = () => {
    setMode("repeat");
    narrate();
  };

  const startRecording = () => {
    setMode("record");
    setRecording(null);
    sr.start();
  };

  const stopRecording = () => {
    sr.stop();
  };

  useEffect(() => {
    if (mode === "record" && sr.transcript && !sr.listening) {
      setRecording(sr.transcript);
      if (!xpAwarded.has(`record-${pageIdx}`)) {
        onAddXp(10);
        setXpAwarded((prev) => new Set([...prev, `record-${pageIdx}`]));
      }
    }
  }, [sr.transcript, sr.listening, mode, pageIdx, xpAwarded, onAddXp]);

  useEffect(() => {
    if (mode === "repeat" && !isNarrating) {
      const t = setTimeout(() => {
        if (mode === "repeat") sr.start();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [isNarrating, mode, sr]);

  useEffect(() => {
    if (mode === "repeat" && sr.transcript && !sr.listening) {
      setRecording(sr.transcript);
      if (!xpAwarded.has(`repeat-${pageIdx}`)) {
        onAddXp(8);
        setXpAwarded((prev) => new Set([...prev, `repeat-${pageIdx}`]));
      }
    }
  }, [sr.transcript, sr.listening, mode, pageIdx, xpAwarded, onAddXp]);

  const flipClass = flipDir === "next" ? "book-flip-next" : "book-flip-prev";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#e8e0d0" }}>
      {/* Header - styled like a book cover band */}
      <div
        className="px-5 pt-5 pb-4 text-paper relative"
        style={{ backgroundColor: story.coverColor }}
      >
        <button
          onClick={() => {
            window.speechSynthesis?.cancel();
            onBack();
          }}
          className="text-paper/70 text-sm mb-2 hover:text-paper flex items-center gap-1 stamp-btn"
        >
          <BackArrow size={14} /> Library
        </button>
        <div className="flex items-center gap-2">
          <BookIcon size={18} className="text-paper" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-[family-name:var(--font-hand)] font-bold truncate">
              {story.title}
            </h2>
            <p className="text-xs text-paper/70 font-[family-name:var(--font-typed)]">
              {story.titleEn}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="level-badge">
              {LEVEL_LABELS[story.level] || "A1"}
            </span>
            <span className="text-xs text-paper/80 font-[family-name:var(--font-typed)] bg-paper/15 px-2 py-0.5 rounded-sm">
              {pageIdx + 1} / {totalPages}
            </span>
          </div>
        </div>
        {/* Page progress as dots */}
        <div className="mt-3 flex items-center gap-1 justify-center">
          {story.pages.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === pageIdx ? 16 : 6,
                height: 6,
                backgroundColor: i <= pageIdx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                borderRadius: i === pageIdx ? 3 : "50%",
              }}
            />
          ))}
        </div>
      </div>

      {/* Story page - styled like an open book */}
      <div className="flex-1 px-3 py-4">
        <div key={flipKey} className={flipClass}>
          {/* The book page */}
          <div className="book-page page-dog-ear mx-auto" style={{ maxWidth: 520 }}>
            {/* Bookmark ribbon */}
            <div className="bookmark-ribbon" />

            {/* Page content area */}
            <div className="relative z-1 p-5 pl-8">
              {/* Page number */}
              <p className="text-center text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-4">
                — {pageIdx + 1} —
              </p>

              {/* Story text with drop cap */}
              <div className="mb-5">
                <p
                  ref={storyTextRef}
                  lang={langCode}
                  className={`text-lg text-ink leading-[1.9] font-[family-name:var(--font-print)] ${pageIdx === 0 ? "story-text" : ""}`}
                >
                  {page.text}
                </p>
              </div>

              {/* Pencil divider */}
              <hr className="pencil-line" />

              {/* Translation toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-xs text-blue-ink stamp-btn mb-2 flex items-center gap-1 font-bold"
              >
                {showTranslation ? "▼" : "▶"} Translation
              </button>
              {showTranslation && (
                <div className="sticky-note mb-4 fade-in" style={{ transform: "rotate(-0.5deg)" }}>
                  <p className="text-sm">{page.translation}</p>
                </div>
              )}

              {/* Vocab toggle */}
              <button
                onClick={() => setShowVocab(!showVocab)}
                className="text-xs text-green-check stamp-btn mb-2 flex items-center gap-1 font-bold"
              >
                {showVocab ? "▼" : "▶"} Vocabulary ({page.vocab.length} words)
              </button>
              {showVocab && (
                <div className="space-y-1.5 fade-in mb-3">
                  {page.vocab.map((v) => (
                    <button
                      key={v.word}
                      onClick={() => speakWord(v.word, user.lang, langCode)}
                      className="vocab-row flex items-center justify-between rounded-sm px-3 py-2 w-full text-left"
                      style={{
                        backgroundColor: "#faf8f2",
                        border: "1px dashed #d4cdc0",
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <SpeakerIcon size={12} className="text-pencil-light" />
                        <span className="font-bold text-sm text-ink">{v.word}</span>
                      </span>
                      <span className="text-xs text-pencil font-[family-name:var(--font-typed)]">
                        {v.meaning}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Narration progress bar */}
          {isNarrating && (
            <div className="mx-auto mt-2" style={{ maxWidth: 520 }}>
              <div className="narration-progress-track">
                <div
                  ref={progressRef}
                  className="narration-progress-fill"
                  style={{ backgroundColor: story.coverColor }}
                />
              </div>
            </div>
          )}

          {/* Audio controls - styled as a bookmark/tab below the book */}
          <div
            className="mx-auto mt-3 p-4 rounded-sm"
            style={{
              maxWidth: 520,
              backgroundColor: "#faf8f2",
              border: "1px solid #d4cdc0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* Listen */}
              <button
                onClick={narrate}
                disabled={isNarrating}
                className="stamp-btn flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 transition-colors"
                style={isNarrating ? {
                  borderColor: "#2c5f8a",
                  backgroundColor: "rgba(44,95,138,0.08)",
                } : {
                  borderColor: "#d4cdc0",
                }}
              >
                <SpeakerIcon
                  size={20}
                  className={isNarrating ? "text-blue-ink speaker-pulse" : "text-pencil"}
                />
                <span className="text-xs font-bold text-ink">
                  {isNarrating ? "Playing..." : "Listen"}
                </span>
              </button>

              {/* Repeat */}
              <button
                onClick={startRepeat}
                disabled={isNarrating || sr.listening}
                className="stamp-btn flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 transition-colors"
                style={(mode === "repeat" && sr.listening) ? {
                  borderColor: "#e8c84a",
                  backgroundColor: "rgba(232,200,74,0.08)",
                } : {
                  borderColor: "#d4cdc0",
                }}
              >
                <span className="text-lg">🔁</span>
                <span className="text-xs font-bold text-ink">
                  {mode === "repeat" && sr.listening ? "Your turn!" : "Repeat"}
                </span>
              </button>

              {/* Record */}
              <button
                onClick={sr.listening ? stopRecording : startRecording}
                className="stamp-btn flex flex-col items-center gap-1.5 p-3 rounded-sm border-2 transition-colors"
                style={(sr.listening && mode === "record") ? {
                  borderColor: "#c0392b",
                  backgroundColor: "rgba(192,57,43,0.08)",
                } : {
                  borderColor: "#d4cdc0",
                }}
              >
                <MicIcon
                  size={20}
                  className={sr.listening && mode === "record" ? "text-red-pen" : "text-pencil"}
                />
                <span className="text-xs font-bold text-ink">
                  {sr.listening && mode === "record" ? "Stop" : "Read Aloud"}
                </span>
              </button>
            </div>

            {/* Transcript feedback */}
            {sr.listening && sr.transcript && (
              <div className="sticky-note mb-3 fade-in" style={{ transform: "rotate(0.5deg)" }}>
                <p className="text-xs text-pencil-light mb-0.5 font-[family-name:var(--font-typed)]">
                  Hearing:
                </p>
                <p className="text-sm text-ink italic">{sr.transcript}</p>
              </div>
            )}

            {recording && !sr.listening && (
              <div
                className="rounded-sm p-2.5 mb-3 fade-in"
                style={{
                  backgroundColor: "rgba(39,119,74,0.06)",
                  border: "1px solid rgba(39,119,74,0.2)",
                }}
              >
                <p className="text-xs text-green-check mb-0.5 font-bold">
                  {mode === "repeat" ? "You repeated:" : "You read:"}
                </p>
                <p className="text-sm text-ink italic">{recording}</p>
                <p className="text-xs text-green-check mt-1 font-[family-name:var(--font-typed)]">
                  +{mode === "repeat" ? "8" : "10"} XP
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-2">
              <Button
                onClick={goPrev}
                disabled={isFirstPage}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <BackArrow size={12} /> Prev
              </Button>
              {isLastPage ? (
                <Button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    onBack();
                  }}
                  variant="stamp"
                  size="sm"
                  className="flex-1"
                >
                  Finish Story
                </Button>
              ) : (
                <Button
                  onClick={goNext}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Next <ForwardArrow size={12} />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Story complete celebration */}
      {showComplete && (
        <div className="story-complete-overlay" onClick={() => { setShowComplete(false); onBack(); }}>
          <div className="story-complete-seal text-center">
            <div
              className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${story.coverColor} 0%, ${story.coverColor}dd 100%)`,
                boxShadow: `inset 0 2px 8px rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.3)`,
              }}
            >
              <span className="text-4xl">&#11088;</span>
            </div>
            <p className="text-paper text-2xl font-[family-name:var(--font-hand)] font-bold">
              Story Complete!
            </p>
            <p className="text-paper/70 text-sm font-[family-name:var(--font-typed)] mt-1">
              {story.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
