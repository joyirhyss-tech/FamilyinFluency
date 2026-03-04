import { spanishDrills } from "../data/drills-spanish";
import { japaneseDrills } from "../data/drills-japanese";
import { koreanDrills } from "../data/drills-korean";
import { shuffle } from "./shuffle";

const BANKS = {
  spanish: spanishDrills,
  japanese: japaneseDrills,
  korean: koreanDrills,
};

function pickRandom(arr, n) {
  const shuffled = shuffle(arr);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

/**
 * Get drills filtered by language, paths, and difficulty level.
 * Includes ~20% review from one level below.
 */
export function getDrills(lang, paths, level) {
  const all = BANKS[lang] || [];

  const matchesPath = (d) =>
    d.path === "general" || paths.includes(d.path);

  // Primary: drills at user's current level
  const primary = all.filter(
    (d) => d.level === level && matchesPath(d)
  );

  // Review: drills from one level below
  const reviewPool =
    level > 0
      ? all.filter((d) => d.level === level - 1 && matchesPath(d))
      : [];

  const reviewCount = Math.ceil(primary.length * 0.25);
  const review = pickRandom(reviewPool, reviewCount);

  return shuffle([...primary, ...review]);
}
