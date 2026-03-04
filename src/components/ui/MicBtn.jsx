import { MicIcon } from "../icons/Icons";

export function MicBtn({ listening, onStart, onStop, supported, size = 52 }) {
  if (!supported) {
    return <span className="text-xs text-pencil-light px-2">Mic unavailable</span>;
  }

  return (
    <button
      onClick={listening ? onStop : onStart}
      className={`
        rounded-full flex items-center justify-center
        stamp-btn flex-shrink-0 relative border-2
        ${listening
          ? "bg-red-pen border-red-pen text-paper"
          : "bg-ink border-ink text-paper hover:bg-pencil"
        }
      `}
      style={{ width: size, height: size }}
    >
      <MicIcon size={size * 0.4} className="text-paper relative z-10" />
      {listening && (
        <span
          className="absolute inset-0 rounded-full border-2 border-red-pen pulse-ring"
        />
      )}
    </button>
  );
}
