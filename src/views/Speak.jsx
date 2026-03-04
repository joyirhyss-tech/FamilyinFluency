import { useState, useEffect } from "react";
import { LANGS } from "../data/constants";
import { getDrills } from "../utils/getDrills";
import { speak } from "../hooks/useSpeech";
import { useMic } from "../hooks/useMic";
import { BackArrow, ForwardArrow, SpeakIcon, SpeakerIcon, MicIcon } from "../components/icons/Icons";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { MicBtn } from "../components/ui/MicBtn";

export function Speak({ user, onBack, onAddXp }) {
  const [allDrills] = useState(() => getDrills(user.lang, user.paths, user.diff));
  const phrases = allDrills.filter(d => d.audio).slice(0, 12);
  const [idx, setIdx] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(new Set());
  const langCode = LANGS[user.lang]?.code || "es-MX";
  const sr = useMic(langCode);

  const phrase = phrases[idx % Math.max(phrases.length, 1)];

  if (phrases.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <Card className="p-6 text-center max-w-sm">
          <p className="text-ink font-bold mb-2">No pronunciation drills</p>
          <Button onClick={onBack}>Go Back</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col notebook-paper">
      {/* Header */}
      <div className="bg-ink px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-pencil-light hover:text-paper stamp-btn">
          <BackArrow size={18} />
        </button>
        <div className="text-paper flex-1">
          <p className="font-bold text-sm flex items-center gap-1.5">
            <SpeakIcon size={14} /> Pronunciation Lab
          </p>
          <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)]">
            {LANGS[user.lang]?.name} — Listen, speak, compare
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <Card className="p-6 w-full max-w-sm text-center fade-in">
          <p className="text-xs text-pencil-light font-[family-name:var(--font-typed)] mb-3">
            Phrase {(idx % phrases.length) + 1} of {phrases.length}
          </p>

          {/* Phrase display */}
          <div className="bg-paper-dark rounded-sm p-4 mb-5 border-2 border-paper-line">
            <p className="text-lg font-bold text-ink mb-1 font-[family-name:var(--font-hand)]" lang={langCode}>
              {phrase?.a}
            </p>
            <p className="text-sm text-pencil">{phrase?.q}</p>
          </div>

          {/* Listen button */}
          <div className="mb-5">
            <Button
              onClick={() => speak(phrase?.audio || phrase?.a, langCode)}
              variant="blue"
              size="md"
              className="w-full"
            >
              <SpeakerIcon size={16} /> Listen to Pronunciation
            </Button>
          </div>

          {/* Record */}
          <div className="mb-5">
            <div className="flex flex-col items-center gap-3">
              <MicBtn
                listening={sr.listening}
                onStart={sr.start}
                onStop={sr.stop}
                supported={sr.supported}
                size={72}
              />
              <p className="text-xs text-pencil-light">
                {sr.listening
                  ? "Listening... speak now!"
                  : sr.supported
                  ? "Tap to record yourself"
                  : "Mic not available in this browser"}
              </p>
            </div>

            {sr.transcript && (
              <div className="mt-3 p-3 bg-highlight-soft rounded-sm border border-highlight">
                <p className="text-xs text-pencil mb-1">You said:</p>
                <p className="text-base font-bold text-ink font-[family-name:var(--font-typed)]">
                  {sr.transcript}
                </p>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              const nextIdx = idx + 1;
              setIdx(nextIdx);
              if (!xpAwarded.has(nextIdx)) {
                onAddXp(10);
                setXpAwarded((prev) => new Set([...prev, nextIdx]));
              }
            }}
            variant="success"
            size="md"
          >
            Next Phrase <ForwardArrow size={14} />
          </Button>
        </Card>
      </div>
    </div>
  );
}
