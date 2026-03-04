import { useState, useEffect, useRef, useCallback } from "react";

export function useMic(langCode = "es-MX") {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      recRef.current = new SR();
    } else {
      setSupported(false);
    }
  }, []);

  const start = useCallback(() => {
    if (!recRef.current || listening) return;
    try {
      recRef.current.lang = langCode;
      recRef.current.interimResults = true;
      recRef.current.continuous = false;
      recRef.current.onresult = (e) => {
        setTranscript(
          Array.from(e.results).map((r) => r[0].transcript).join("")
        );
      };
      recRef.current.onend = () => setListening(false);
      recRef.current.onerror = () => setListening(false);
      setTranscript("");
      setListening(true);
      recRef.current.start();
    } catch {
      setListening(false);
    }
  }, [langCode, listening]);

  const stop = useCallback(() => {
    if (recRef.current) {
      try { recRef.current.stop(); } catch { /* already stopped */ }
    }
    setListening(false);
  }, []);

  return { transcript, listening, supported, start, stop };
}
