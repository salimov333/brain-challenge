/* ============================================================
   I18N MODULE - Multi-language support
   Supported: English (default), German, Arabic
=========================================================== */
const STORAGE_KEY = 'brainChallenge_lang';

let currentLang = 'en';
let translations = {};

/**
 * Get saved language from localStorage or default to English
 */
function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'ar', 'de'].includes(saved)) {
      return saved;
    }
  } catch {}
  return 'en';
}

/**
 * Save language preference to localStorage
 */
function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {}
}

/**
 * Load translation file for the specified language
 * @param {string} lang - Language code (en, ar, de)
 */
export async function setLanguage(lang) {
  if (!['en', 'ar', 'de'].includes(lang)) {
    console.error(`Unsupported language: ${lang}`);
    return;
  }

  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${lang}.json`);
    }
    translations = await response.json();
    currentLang = lang;
    saveLanguage(lang);
    
    // Apply translations to DOM
    applyTranslations();
    
    // Update document direction for RTL languages
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    console.log(`Language changed to: ${lang}`);
  } catch (error) {
    console.error('Error loading translations:', error);
  }
}

/**
 * Get translation for a key
 * @param {string} key - Dot-notation key (e.g., 'app.title')
 * @returns {string} Translated string or key if not found
 */
export function t(key) {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated !== key) {
      el.textContent = translated;
    }
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = t(key);
    if (translated !== key) {
      el.placeholder = translated;
    }
  });

  // Title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = t(key);
    if (translated !== key) {
      el.title = translated;
    }
  });
}

/**
 * Get current language code
 * @returns {string} Current language code
 */
export function getCurrentLang() {
  return currentLang;
}

/**
 * Initialize i18n with saved language or default
 */
export async function initI18n() {
  const savedLang = getSavedLanguage();
  await setLanguage(savedLang);
  return currentLang;
}

/**
 * Change language and return new language
 * @param {string} lang - Language code
 * @returns {Promise<string>} New language code
 */
export async function changeLanguage(lang) {
  await setLanguage(lang);
  return currentLang;
}

/**
 * Get levels data for the current language
 * @returns {Array} Levels array with questions
 */
export function getLevels() {
  return translations.questionsData || [];
}

/**
 * Get level metadata for the current language
 * @returns {Array} Level metadata array
 */
export function getLevelMeta() {
  return translations.levelMetaData || [];
}

// Re-export for convenience
export default {
  t,
  setLanguage,
  getCurrentLang,
  initI18n,
  changeLanguage,
  getLevels,
  getLevelMeta
};

