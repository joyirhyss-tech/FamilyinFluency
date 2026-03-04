import { XP_PER_LEVEL } from "../data/constants";

/**
 * Update streak based on last active date.
 * Returns { streak, lastActiveDate }
 */
export function updateStreak(currentStreak, lastActiveDate) {
  const today = new Date().toDateString();
  if (lastActiveDate === today) {
    return { streak: currentStreak, lastActiveDate };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActiveDate === yesterday.toDateString()) {
    return { streak: currentStreak + 1, lastActiveDate: today };
  }

  // Streak broken
  return { streak: 1, lastActiveDate: today };
}

/**
 * Check if weekly XP should be reset (new week = Monday).
 */
export function shouldResetWeeklyXp(weekStart) {
  if (!weekStart) return true;
  const now = new Date();
  const start = new Date(weekStart);
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return diffDays >= 7;
}

export function getLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getLevelProgress(xp) {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}
