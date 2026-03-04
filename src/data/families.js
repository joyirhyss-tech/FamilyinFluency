/**
 * Family registry — seed data + dynamic helpers.
 *
 * code:  URL-safe uppercase word-pair (shared as invite link)
 * name:  Default family display name (editable by admin in-app)
 * owner: true on at most one entry (marks your family in Owner Dashboard)
 */
export const DEFAULT_FAMILIES = [
  { code: "RHYSS-FAM",    name: "Rhyss",                      owner: true },
  { code: "MAPLE-TREE",   name: "Garcias",                     owner: false },
  { code: "BLUE-OCEAN",   name: "Johnsons",                    owner: false },
  { code: "CORAL-WIND",   name: "inFluency Circle 1",          owner: false },
  { code: "SAGE-MOON",    name: "inFluency Circle 2",          owner: false },
  { code: "RUBY-FERN",    name: "inFluency Circle 3",          owner: false },
  { code: "GOLD-WREN",    name: "inFluency Circle 4",          owner: false },
  { code: "JADE-LARK",    name: "inFluency Circle 5",          owner: false },
  { code: "IRIS-DAWN",    name: "inFluency Circle 6",          owner: false },
  { code: "TEAL-COVE",    name: "inFluency Circle 7",          owner: false },
  { code: "PLUM-GLOW",    name: "inFluency Circle 8",          owner: false },
  { code: "MIST-VALE",    name: "inFluency Circle 9",          owner: false },
  { code: "BLOOM-SPARK",  name: "inFluency Circle 10",         owner: false },
];

// Back-compat alias (referenced in imports elsewhere)
export const FAMILIES = DEFAULT_FAMILIES;

/**
 * Special owner passphrase — entering this at the Gate opens the Owner Dashboard.
 * This is NOT a family code; it is a separate admin secret.
 */
export const OWNER_CODE = "OWNER-2026";

/**
 * Word list for generating memorable family codes.
 * Format: WORD-WORD (e.g., CORAL-WIND, SAGE-MOON)
 */
const CODE_WORDS = [
  "STAR", "MOON", "SUN", "LEAF", "PINE", "OAK", "WAVE", "WIND",
  "RAIN", "SNOW", "ROSE", "FIRE", "LAKE", "HILL", "DOVE", "HAWK",
  "DEER", "BEAR", "WOLF", "FOX", "SAGE", "TEAL", "PLUM", "JADE",
  "RUBY", "GOLD", "CORAL", "IRIS", "FERN", "WREN", "LARK", "DUSK",
  "DAWN", "GLOW", "MIST", "COVE", "VALE", "REED", "BLOOM", "SPARK",
];

/**
 * Generate a unique WORD-WORD family code.
 * @param {string[]} existingCodes — codes already in use
 * @returns {string} — e.g. "CORAL-WIND"
 */
export function generateFamilyCode(existingCodes = []) {
  const used = new Set(existingCodes.map((c) => c.toUpperCase()));
  // Try up to 100 times to avoid collision
  for (let i = 0; i < 100; i++) {
    const a = CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
    const b = CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)];
    if (a === b) continue; // skip same-word pairs
    const code = `${a}-${b}`;
    if (!used.has(code)) return code;
  }
  // Fallback: timestamp-based
  return `FAM-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Look up a family by its code (case-insensitive).
 * @param {string} code — the code to look up
 * @param {Array} familyList — dynamic list to search (defaults to DEFAULT_FAMILIES)
 */
export function findFamily(code, familyList) {
  if (!code) return undefined;
  const list = familyList || DEFAULT_FAMILIES;
  const normalized = code.trim().toUpperCase();
  return list.find((f) => f.code === normalized);
}

/**
 * Build the full magic link URL for a family code.
 */
export function magicLink(code) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://influency.app";
  return `${origin}?join=${encodeURIComponent(code)}`;
}
