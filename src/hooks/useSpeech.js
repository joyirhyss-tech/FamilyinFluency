/**
 * Speech utilities with pre-generated audio support.
 * Tries Edge TTS neural audio first, falls back to Web Speech API.
 */

const LANG_CODES = {
  spanish: "es",
  japanese: "ja",
  korean: "ko",
};

// Cache vocab manifests so we only fetch once per language
const manifestCache = {};
// Cache timing data so we only fetch once per page
const timingCache = {};

async function loadManifest(lang) {
  const code = LANG_CODES[lang];
  if (!code) return null;
  if (manifestCache[code]) return manifestCache[code];

  try {
    const resp = await fetch(`/audio/${code}/vocab-manifest.json`);
    if (resp.ok) {
      manifestCache[code] = await resp.json();
      return manifestCache[code];
    }
  } catch {}
  return null;
}

/**
 * Play pre-generated audio for a vocab word.
 * Falls back to Web Speech API if no audio file found.
 */
export async function speakWord(word, lang, langCode = "es-MX") {
  const manifest = await loadManifest(lang);
  if (manifest && manifest[word]) {
    const code = LANG_CODES[lang];
    const audio = new Audio(`/audio/${code}/vocab/${manifest[word]}`);
    audio.playbackRate = 1.0;
    audio.play().catch(() => {
      // Fallback to Web Speech API
      speak(word, langCode);
    });
    return;
  }
  // No pre-generated audio, use Web Speech API
  speak(word, langCode);
}

/**
 * Load word timing data for a story page.
 * Returns a promise that resolves to an array of {offset, duration, text} or null.
 */
export async function loadTimingData(storyId, pageNum, lang) {
  const code = LANG_CODES[lang];
  if (!code) return null;
  const filename = `${storyId}-page-${String(pageNum).padStart(2, "0")}.timing.json`;
  const key = `${code}/${filename}`;
  if (timingCache[key] !== undefined) return timingCache[key];

  try {
    const resp = await fetch(`/audio/${code}/stories/${filename}`);
    if (resp.ok) {
      const data = await resp.json();
      timingCache[key] = data;
      return data;
    }
  } catch {}
  timingCache[key] = null;
  return null;
}

/**
 * Play pre-generated audio for a story page.
 * Returns a promise-like object with an onend callback.
 */
export function speakStoryPage(storyId, pageNum, lang, langCode = "es-MX", pageText = "") {
  const code = LANG_CODES[lang];
  const filename = `${storyId}-page-${String(pageNum).padStart(2, "0")}.mp3`;
  const audioPath = `/audio/${code}/stories/${filename}`;

  const result = {
    _onend: null,
    _onerror: null,
    _audio: null,
    _timingData: null,
    _timingPromise: loadTimingData(storyId, pageNum, lang),
    onend(cb) { this._onend = cb; return this; },
    onerror(cb) { this._onerror = cb; return this; },
    cancel() {
      if (this._audio) {
        this._audio.pause();
        this._audio.currentTime = 0;
      }
      window.speechSynthesis?.cancel();
    },
  };

  // Load timing data in background
  result._timingPromise.then((data) => { result._timingData = data; });

  // Try pre-generated audio first
  const audio = new Audio(audioPath);
  result._audio = audio;

  audio.addEventListener("ended", () => {
    if (result._onend) result._onend();
  });

  audio.addEventListener("error", () => {
    // Fallback to Web Speech API
    if (!window.speechSynthesis) {
      if (result._onerror) result._onerror();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(pageText);
    u.lang = langCode;
    u.rate = 0.65;
    u.onend = () => { if (result._onend) result._onend(); };
    u.onerror = () => { if (result._onerror) result._onerror(); };
    window.speechSynthesis.speak(u);
  });

  audio.play().catch(() => {
    // If play() fails, fall back
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(pageText);
    u.lang = langCode;
    u.rate = 0.65;
    u.onend = () => { if (result._onend) result._onend(); };
    u.onerror = () => { if (result._onerror) result._onerror(); };
    window.speechSynthesis.speak(u);
  });

  return result;
}

/**
 * Basic Web Speech API speak (fallback).
 * Selects the best available voice for the language.
 */
export function speak(text, langCode = "es-MX") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = langCode;
  u.rate = 0.85;

  // Try to find a premium/neural voice
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = langCode.split("-")[0];
  const premiumVoice = voices.find(
    (v) => v.lang.startsWith(langPrefix) && (v.name.includes("Premium") || v.name.includes("Neural") || v.name.includes("Enhanced"))
  );
  const googleVoice = voices.find(
    (v) => v.lang.startsWith(langPrefix) && v.name.includes("Google")
  );
  const anyVoice = voices.find((v) => v.lang.startsWith(langPrefix));

  if (premiumVoice) u.voice = premiumVoice;
  else if (googleVoice) u.voice = googleVoice;
  else if (anyVoice) u.voice = anyVoice;

  window.speechSynthesis.speak(u);
}
