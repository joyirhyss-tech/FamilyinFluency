/**
 * Normalize an answer string for comparison:
 * - lowercase
 * - strip diacritics (á→a, ñ→n, etc.)
 * - strip punctuation
 * - collapse whitespace
 */
export function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // strip diacritics
    .replace(/[¿¡?!.,;:'"()[\]{}—–-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if a given answer matches the correct answer,
 * allowing for partial matches and alternative answers.
 */
export function checkAnswer(given, correct, alts = []) {
  const g = normalize(given);
  const c = normalize(correct);
  if (!g) return false;

  // Exact match
  if (g === c) return true;

  // Check alternatives
  for (const alt of alts) {
    if (g === normalize(alt)) return true;
  }

  // Flexible: correct contains given or vice versa (for partial answers)
  if (c.includes(g) && g.length >= c.length * 0.6) return true;
  if (g.includes(c)) return true;

  return false;
}
