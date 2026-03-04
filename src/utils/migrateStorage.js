import { familyKey } from "./familyKey";

/**
 * One-time migration: moves unprefixed localStorage keys to the RHYSS-FAM
 * namespace and auto-activates the family, so existing users skip the Gate.
 *
 * Call ONCE before React renders (in main.jsx).
 */
export function migrateOldData() {
  try {
    const oldPlayers = localStorage.getItem("fluency-players");
    const newPlayers = localStorage.getItem(familyKey("RHYSS-FAM", "players"));

    // Only migrate if old data exists AND new prefixed data does NOT
    if (oldPlayers && !newPlayers) {
      const keysToMigrate = ["players", "daily-words", "family-name", "week-start"];

      keysToMigrate.forEach((base) => {
        const oldKey = `fluency-${base}`;
        const newKey = familyKey("RHYSS-FAM", base);
        const data = localStorage.getItem(oldKey);
        if (data) {
          localStorage.setItem(newKey, data);
          localStorage.removeItem(oldKey);
        }
      });

      // Auto-activate RHYSS-FAM so existing users skip the Gate
      localStorage.setItem("fluency-active-family", JSON.stringify("RHYSS-FAM"));
    }
  } catch {
    // Silent fail — migration is best-effort
  }
}
