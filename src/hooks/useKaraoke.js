import { useEffect, useRef } from "react";

/**
 * Karaoke word highlighting hook.
 * Manages all highlighting via direct DOM manipulation for 60fps performance.
 *
 * @param {Object} opts
 * @param {React.RefObject} opts.textRef - ref to the <p> element containing story text
 * @param {Object|null} opts.audioPlayer - the player object from speakStoryPage
 * @param {string} opts.pageText - the story page text
 * @param {string} opts.coverColor - the story's accent color
 * @param {boolean} opts.isFirstPage - whether this is page 0 (has drop cap)
 * @param {boolean} opts.isNarrating - whether audio is currently playing
 * @param {React.RefObject} opts.progressRef - ref to the progress bar element
 */
export function useKaraoke({ textRef, audioPlayer, pageText, coverColor, isFirstPage, isNarrating, progressRef }) {
  const cleanupRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const el = textRef?.current;
    if (!el || !audioPlayer || !isNarrating) {
      // Clean up if narration stopped
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      return;
    }

    const audio = audioPlayer._audio;
    if (!audio) return;

    // Split text into word spans via DOM
    const originalHTML = el.innerHTML;
    const words = pageText.split(/(\s+)/);
    let spanHTML = "";
    let wordIdx = 0;
    for (const part of words) {
      if (/^\s+$/.test(part)) {
        spanHTML += part;
      } else {
        spanHTML += `<span class="karaoke-word" data-widx="${wordIdx}">${part}</span>`;
        wordIdx++;
      }
    }
    el.innerHTML = spanHTML;

    // Set CSS custom property for highlight color (coverColor at 25% opacity)
    el.style.setProperty("--hl-color", hexToRgba(coverColor, 0.25));
    el.style.setProperty("--hl-color-past", hexToRgba(coverColor, 0.15));

    const wordSpans = el.querySelectorAll(".karaoke-word");
    const totalWords = wordSpans.length;
    let lastActiveIdx = -1;

    // Build timing: either from real data or estimate
    let wordTimings = null;

    const setupTiming = (timingData) => {
      if (timingData && timingData.length > 0) {
        wordTimings = timingData;
      } else {
        // Estimate: proportional to character count
        const duration = audio.duration || 10;
        const totalChars = words.filter((w) => !/^\s+$/.test(w)).reduce((s, w) => s + w.length, 0);
        let cumOffset = 0;
        wordTimings = words
          .filter((w) => !/^\s+$/.test(w))
          .map((w) => {
            const dur = (w.length / totalChars) * duration;
            const entry = { offset: cumOffset, duration: dur, text: w };
            cumOffset += dur;
            return entry;
          });
      }
    };

    // Try to get real timing data
    if (audioPlayer._timingData) {
      setupTiming(audioPlayer._timingData);
    } else if (audioPlayer._timingPromise) {
      audioPlayer._timingPromise.then((data) => {
        if (!cleanupRef.current) return; // already cleaned up
        setupTiming(data);
      });
      // Start with estimation until real data loads
      const waitForDuration = () => {
        if (audio.duration && isFinite(audio.duration)) {
          setupTiming(null);
        } else {
          audio.addEventListener("loadedmetadata", () => setupTiming(null), { once: true });
        }
      };
      waitForDuration();
    }

    // Binary search for current word index
    const findActiveWord = (time) => {
      if (!wordTimings || wordTimings.length === 0) return -1;
      let lo = 0, hi = wordTimings.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const wt = wordTimings[mid];
        if (time < wt.offset) {
          hi = mid - 1;
        } else if (time > wt.offset + wt.duration) {
          lo = mid + 1;
        } else {
          return mid;
        }
      }
      // If past the last word boundary, return last word
      if (lo > 0 && lo >= wordTimings.length) return wordTimings.length - 1;
      return lo < wordTimings.length ? lo : -1;
    };

    // Update handler using requestAnimationFrame for smoother updates
    const onTimeUpdate = () => {
      if (!wordTimings) return;
      const time = audio.currentTime;

      // Update progress bar
      if (progressRef?.current && audio.duration) {
        progressRef.current.style.width = `${(time / audio.duration) * 100}%`;
      }

      const activeIdx = findActiveWord(time);
      if (activeIdx === lastActiveIdx) return;

      // Remove active from previous
      if (lastActiveIdx >= 0 && lastActiveIdx < totalWords) {
        wordSpans[lastActiveIdx].classList.remove("karaoke-active");
        wordSpans[lastActiveIdx].classList.add("karaoke-past");
        // Remove word-dur transition for past words
        wordSpans[lastActiveIdx].style.removeProperty("--word-dur");
      }

      // Mark all words before active as past
      for (let i = lastActiveIdx + 1; i < activeIdx && i < totalWords; i++) {
        wordSpans[i].classList.remove("karaoke-active");
        wordSpans[i].classList.add("karaoke-past");
      }

      // Set new active
      if (activeIdx >= 0 && activeIdx < totalWords) {
        const wt = wordTimings[activeIdx];
        wordSpans[activeIdx].style.setProperty("--word-dur", `${wt?.duration || 0.3}s`);
        wordSpans[activeIdx].classList.add("karaoke-active");
        wordSpans[activeIdx].classList.remove("karaoke-past");

        // Auto-scroll if word is out of view
        const rect = wordSpans[activeIdx].getBoundingClientRect();
        if (rect.bottom > window.innerHeight - 100 || rect.top < 80) {
          wordSpans[activeIdx].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }

      lastActiveIdx = activeIdx;
    };

    // Use timeupdate + requestAnimationFrame for good perf
    const rafUpdate = () => {
      onTimeUpdate();
      if (cleanupRef.current) {
        animFrameRef.current = requestAnimationFrame(rafUpdate);
      }
    };
    // Start the animation loop
    animFrameRef.current = requestAnimationFrame(rafUpdate);

    // Cleanup function
    const cleanup = () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Reset progress bar
      if (progressRef?.current) {
        progressRef.current.style.width = "0%";
      }
      // Restore original text
      if (el) {
        el.innerHTML = originalHTML;
      }
    };

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [isNarrating, audioPlayer, pageText, coverColor]);
}

// Convert hex color to rgba string
function hexToRgba(hex, alpha) {
  if (!hex) return `rgba(200, 150, 50, ${alpha})`;
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
