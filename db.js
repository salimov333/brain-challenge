/* ============================================================
   DATA – All questions and answers grouped by level
   Now loaded from locale JSON files via i18n.js
   Exported for use in app.js
=========================================================== */
import { getLevels, getLevelMeta } from './i18n.js';

/**
 * Get the current LEVELS data based on language
 * This function retrieves questions from the loaded locale file
 */
export async function loadLevels() {
  // Ensure i18n is initialized - this is handled by app.js
  return getLevels();
}

/**
 * Get the current LEVEL_META data based on language
 */
export async function loadLevelMeta() {
  return getLevelMeta();
}

// For backwards compatibility, export a promise that resolves to levels
export const LEVELS = {
  then(resolve) {
    getLevels().then(resolve);
  }
};

export const LEVEL_META = {
  then(resolve) {
    getLevelMeta().then(resolve);
  }
};

// Also export as async getters for direct access
export async function getLEVELS() {
  return getLevels();
}

export async function getLEVEL_META() {
  return getLevelMeta();
}

