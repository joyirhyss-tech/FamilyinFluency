import { SpeakerIcon } from "../icons/Icons";
import { speak } from "../../hooks/useSpeech";

export function SpeakerBtn({ text, langCode = "es-MX" }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        speak(text, langCode);
      }}
      className="text-pencil-light hover:text-blue-ink stamp-btn p-1 flex-shrink-0"
      title="Listen"
    >
      <SpeakerIcon size={16} />
    </button>
  );
}
