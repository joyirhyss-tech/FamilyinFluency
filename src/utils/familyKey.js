/**
 * Build a localStorage key prefixed by family code.
 * e.g. familyKey("MAPLE-TREE", "players") => "fluency-MAPLE-TREE-players"
 */
export const familyKey = (code, base) => `fluency-${code}-${base}`;
