import { useState, useEffect, useRef } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Track the previous key to detect changes
  const prevKeyRef = useRef(key);

  // Re-read from storage when key changes (e.g., switching families)
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      prevKeyRef.current = key;
      try {
        const stored = localStorage.getItem(key);
        setValue(stored !== null ? JSON.parse(stored) : initialValue);
      } catch {
        setValue(initialValue);
      }
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Write to storage when value or key changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Notify sync engine that data changed
      window.dispatchEvent(new CustomEvent("ls-change", { detail: { key } }));
    } catch { /* quota exceeded, silently fail */ }
  }, [key, value]);

  return [value, setValue];
}
