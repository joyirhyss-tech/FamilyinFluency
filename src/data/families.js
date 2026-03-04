/**
 * Family registry — add new families here, redeploy.
 *
 * code:  URL-safe uppercase word-pair (shared as invite link)
 * name:  Default family display name (editable by admin in-app)
 * owner: true on at most one entry (marks your family in Owner Dashboard)
 */
export const FAMILIES = [
  { code: "RHYSS-FAM",   name: "Rhyss",     owner: true },
  { code: "MAPLE-TREE",  name: "Garcias",    owner: false },
  { code: "BLUE-OCEAN",  name: "Johnsons",   owner: false },
  // Add more families here and redeploy
];

/**
 * Special owner passphrase — entering this at the Gate opens the Owner Dashboard.
 * This is NOT a family code; it is a separate admin secret.
 */
export const OWNER_CODE = "OWNER-2026";

/**
 * Look up a family by its code (case-insensitive).
 */
export function findFamily(code) {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();
  return FAMILIES.find((f) => f.code === normalized);
}

/**
 * Build the full magic link URL for a family code.
 */
export function magicLink(code) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://influency.app";
  return `${origin}?join=${encodeURIComponent(code)}`;
}
