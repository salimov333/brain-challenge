/* ============================================================
   Import data from i18n.js (loads from locale JSON files)
=========================================================== */
import { getLevels, getLevelMeta, initI18n, t } from './i18n.js';

// Global state for levels - loaded from i18n
let LEVELS = [];
let LEVEL_META = [];

/* ============================================================
   STATE & STORAGE
   Uses localStorage to persist: score, currentLevel, currentQuestion
=========================================================== */
const STORAGE_KEY = "brainChallenge_v1";

/** @returns {Object} persisted state */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {Object} s - state to persist */
function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/* ============================================================
   APP CONTROLLER – follows Single Responsibility per method
=========================================================== */
const App = (function () {
  // Internal game state
  let score = 0;
  let currentLevel = 0;
  let currentQuestion = 0;
  /** Track whether each question has been answered or peeked at
   *  to enforce the 10-point peek penalty correctly. */
  let questionStatus = {}; // key: "L-Q" → 'correct' | 'wrong' | 'peeked'

  /* ----------------------------------------------------------------
     INIT
  ---------------------------------------------------------------- */
  async function init() {
    // First initialize i18n to load translations and levels
    await initI18n();
    
    // Load levels from i18n (based on current language)
    LEVELS = getLevels();
    LEVEL_META = getLevelMeta();
    
    buildLevelGrid();
    _checkSavedState();
  }

  /** Populate welcome screen with saved state info */
  function _checkSavedState() {
    const saved = loadState();
    if (
      saved &&
      (saved.score !== 0 ||
        saved.currentLevel > 0 ||
        saved.currentQuestion > 0)
    ) {
      document.getElementById("welcome-stats").style.display = "flex";
      document.getElementById("saved-score").textContent = saved.score;
      
      // Use translated level text
      const levelName = LEVEL_META[saved.currentLevel]?.range || `Level ${saved.currentLevel + 1}`;
      document.getElementById("saved-q").textContent =
        `${levelName}, ${t('quiz.question')} ${saved.currentQuestion + 1}`;
      document.getElementById("btn-resume").style.display = "inline-flex";
    }
  }

  /* ----------------------------------------------------------------
     NAVIGATION
  ---------------------------------------------------------------- */
  function showScreen(id) {
    document
      .querySelectorAll(".screen")
      .forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  function showWelcome() {
    showScreen("welcome-screen");
  }
  function showLevelSelect() {
    buildLevelGrid();
    showScreen("level-screen");
  }

  /* ----------------------------------------------------------------
     LEVEL GRID
  ---------------------------------------------------------------- */
  function buildLevelGrid() {
    const grid = document.getElementById("level-grid");
    grid.innerHTML = "";
    
    if (!LEVELS || LEVELS.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">Loading...</p>';
      return;
    }
    
    LEVELS.forEach((lvl, i) => {
      const saved = loadState();
      const progress = _levelProgress(i, saved);
      const isCompleted = progress >= 100;
      
      // Get translated level name
      const levelName = lvl.name || `Level ${i + 1}`;
      const levelRange = LEVEL_META[i]?.range || `Questions ${i * 20 + 1}-${(i + 1) * 20}`;

      const card = document.createElement("div");
      card.className = "level-card" + (isCompleted ? " completed" : "");
      card.style.setProperty("--lc", lvl.color);
      card.innerHTML = `
        <span class="level-emoji">${lvl.emoji}</span>
        <div class="level-name" style="color:${lvl.color}">${t('levels.level')} ${i + 1}</div>
        <div class="level-name">${levelName}</div>
        <div class="level-range">${levelRange}</div>
        <div class="level-progress" style="margin-top:10px">
          <div class="level-progress-fill" style="width:${progress}%;background:${lvl.color}"></div>
        </div>
      `;
      card.onclick = () => startLevel(i);
      grid.appendChild(card);
    });
  }

  /** Calculate completion % for a level based on saved questionStatus */
  function _levelProgress(lvlIdx, saved) {
    if (!saved || !saved.questionStatus || !LEVELS[lvlIdx]) return 0;
    const total = LEVELS[lvlIdx].questions.length;
    let done = 0;
    for (let q = 0; q < total; q++) {
      const key = `${lvlIdx}-${q}`;
      if (saved.questionStatus[key]) done++;
    }
    return Math.round((done / total) * 100);
  }

  /* ----------------------------------------------------------------
     START / RESUME
  ---------------------------------------------------------------- */
  function startFresh() {
    clearState();
    score = 0;
    currentLevel = 0;
    currentQuestion = 0;
    questionStatus = {};
    _startQuiz();
  }

  function resume() {
    const saved = loadState();
    if (!saved) {
      startFresh();
      return;
    }
    score = saved.score || 0;
    currentLevel = saved.currentLevel || 0;
    currentQuestion = saved.currentQuestion || 0;
    questionStatus = saved.questionStatus || {};
    _startQuiz();
  }

  function startLevel(lvlIdx) {
    const saved = loadState();
    if (saved) {
      score = saved.score || 0;
      questionStatus = saved.questionStatus || {};
    }
    currentLevel = lvlIdx;
    currentQuestion = 0;
    _startQuiz();
  }

  function _startQuiz() {
    showScreen("quiz-screen");
    _renderQuestion();
  }

  /* ----------------------------------------------------------------
     RENDER QUESTION
  ---------------------------------------------------------------- */
  function _renderQuestion() {
    const lvl = LEVELS[currentLevel];
    if (!lvl) return;
    
    const total = lvl.questions.length;
    const q = lvl.questions[currentQuestion];
    const key = `${currentLevel}-${currentQuestion}`;
    const status = questionStatus[key];
    
    // Get translations
    const levelName = lvl.name || `Level ${currentLevel + 1}`;
    const questionLabel = t('quiz.question');

    // Header badges
    document.getElementById("level-badge").textContent =
      `${t('levels.level')} ${currentLevel + 1} – ${levelName}`;
    document.getElementById("q-counter").textContent =
      `${questionLabel} ${currentQuestion + 1} / ${total}`;
    document.getElementById("q-num-label").textContent =
      `${questionLabel} ${currentQuestion + 1}`;

    // Progress
    const pct = (currentQuestion / total) * 100;
    document.getElementById("progress-fill").style.width = pct + "%";

    // Score
    _updateScoreDisplay();

    // Question text
    document.getElementById("question-text").textContent = q.q;

    // Answer input – pre-fill if already answered, disable if correct/peeked
    const input = document.getElementById("answer-input");
    input.value = "";
    input.disabled = false;
    input.style.opacity = "1";

    // Feedback
    const fb = document.getElementById("feedback");
    fb.className = "feedback";
    fb.textContent = "";

    if (status === "correct") {
      input.value = "✅ " + t('feedback.alreadyCorrect');
      input.disabled = true;
      input.style.opacity = ".6";
      _showFeedback(
        "correct",
        "✅ " + t('feedback.alreadyCorrectPrev'),
      );
    } else if (status === "peeked") {
      _showFeedback("info", `💡 ${t('feedback.peekedAnswer')}: ${q.a}`);
    } else if (status === "wrong") {
      _showFeedback("wrong", "❌ " + t('feedback.wrongTryAgain'));
    }

    // Save state on every question render
    _persist();
  }

  /* ----------------------------------------------------------------
     ANSWER LOGIC
  ---------------------------------------------------------------- */
  /**
   * Normalize a string for comparison:
   * strips diacritics, punctuation, extra spaces, and lowercases.
   */
  function _normalize(str) {
    return str
      .replace(/[\u064B-\u065F]/g, "") // Arabic diacritics
      .replace(/[،,\.\s]+/g, " ")
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\s\.≈]/g, "")
      .trim()
      .toLowerCase();
  }

  function _checkAnswer(userInput, correctAnswer) {
    const u = _normalize(userInput);
    const c = _normalize(correctAnswer);
    // Full match
    if (u === c) return true;
    // Partial match: all tokens of correct answer appear in user input
    const tokens = c.split(" ").filter(Boolean);
    return tokens.every((t) => u.includes(t));
  }

  /** Called when user presses check answer button */
  function submitAnswer() {
    const input = document.getElementById("answer-input");
    const userAnswer = input.value.trim();
    if (!userAnswer) {
      _showFeedback("wrong", "⚠️ " + t('feedback.enterAnswer'));
      return;
    }

    const q = LEVELS[currentLevel].questions[currentQuestion];
    const key = `${currentLevel}-${currentQuestion}`;
    const prevStatus = questionStatus[key];

    if (prevStatus === "correct") return; // already correct, ignore

    const isCorrect = _checkAnswer(userAnswer, q.a);

    if (isCorrect) {
      // Award points only if not already wrong-deducted for this question
      score += 10;
      questionStatus[key] = "correct";
      _showFeedback(
        "correct",
        `🎉 ${t('feedback.correct')} +10 ${t('saved.points')}. ${t('feedback.peekedAnswer')}: ${q.a}`,
      );
      _celebrate();
      // Disable input
      input.disabled = true;
      input.style.opacity = ".6";
    } else {
      // Deduct only once per wrong attempt
      score -= 10;
      questionStatus[key] = "wrong";
      _showFeedback(
        "wrong",
        `❌ ${t('feedback.wrong')} -10 ${t('saved.points')}. ${t('feedback.wrongTryAgain')}`,
      );
    }

    _updateScoreDisplay();
    _persist();
  }

  /** Called when user presses show answer button */
  function showAnswer() {
    const q = LEVELS[currentLevel].questions[currentQuestion];
    const key = `${currentLevel}-${currentQuestion}`;
    const status = questionStatus[key];

    // Deduct only if not already correct
    if (status !== "correct") {
      if (status !== "peeked") {
        score -= 10;
        questionStatus[key] = "peeked";
        _updateScoreDisplay();
        _showFeedback(
          "info",
          `💡 ${t('feedback.peekedAnswer')}: ${q.a} (-10 ${t('saved.points')})`,
        );
      } else {
        _showFeedback("info", `💡 ${t('feedback.peekedAnswer')}: ${q.a}`);
      }
    } else {
      _showFeedback("correct", `✅ ${t('feedback.alreadyCorrect')}. ${t('feedback.peekedAnswer')}: ${q.a}`);
    }

    _persist();
  }

  /* ----------------------------------------------------------------
     NAVIGATION BETWEEN QUESTIONS
  ---------------------------------------------------------------- */
  function nextQuestion() {
    const total = LEVELS[currentLevel].questions.length;
    if (currentQuestion < total - 1) {
      currentQuestion++;
      _renderQuestion();
    } else {
      // Level complete – check if last level
      if (currentLevel < LEVELS.length - 1) {
        _showLevelComplete();
      } else {
        _showResults();
      }
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      currentQuestion--;
      _renderQuestion();
    } else if (currentLevel > 0) {
      currentLevel--;
      currentQuestion = LEVELS[currentLevel].questions.length - 1;
      _renderQuestion();
    }
  }

  /* ----------------------------------------------------------------
     LEVEL COMPLETE MODAL (inline in quiz screen)
  ---------------------------------------------------------------- */
  function _showLevelComplete() {
    const next = LEVELS[currentLevel + 1];
    _showFeedback(
      "correct",
      `🎊 ${t('feedback.levelComplete')} ${currentLevel + 1}! ${t('feedback.goToNext')} ${currentLevel + 2} – ${next.name}`,
    );
    setTimeout(() => {
      currentLevel++;
      currentQuestion = 0;
      _startQuiz();
    }, 2000);
  }

  /* ----------------------------------------------------------------
     RESULTS SCREEN
  ---------------------------------------------------------------- */
  function _showResults() {
    let icon = "🏆",
      msg = "";
    if (score >= 800) {
      icon = "🌟";
      msg = t('results.legendary');
    } else if (score >= 500) {
      icon = "🏆";
      msg = t('results.excellent');
    } else if (score >= 200) {
      icon = "🥈";
      msg = t('results.good');
    } else {
      icon = "🧠";
      msg = t('results.thanks');
    }

    document.getElementById("result-icon").textContent = icon;
    document.getElementById("result-score").textContent = score;
    document.getElementById("result-msg").textContent = msg;
    showScreen("results-screen");
  }

  /* ----------------------------------------------------------------
     UI HELPERS
  ---------------------------------------------------------------- */
  function _updateScoreDisplay() {
    const el = document.getElementById("score-el");
    el.textContent = score + " " + t('saved.points');
    el.classList.remove("score-flash");
    void el.offsetWidth; // reflow to restart animation
    el.classList.add("score-flash");
    // Color by score
    el.style.backgroundImage =
      score >= 0
        ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
        : "linear-gradient(135deg, #f87171, #ef4444)";
  }

  function _showFeedback(type, msg) {
    const fb = document.getElementById("feedback");
    fb.className = `feedback ${type} show`;
    fb.textContent = msg;
  }

  /* ----------------------------------------------------------------
     CELEBRATION ANIMATION
  ---------------------------------------------------------------- */
  function _celebrate() {
    // Show message
    const msg = document.getElementById("celebration-msg");
    msg.textContent = `🎉 ${t('feedback.correct')} +10 ${t('saved.points')}`;
    msg.classList.add("show");
    // Confetti
    _spawnConfetti();
    setTimeout(() => msg.classList.remove("show"), 2000);
  }

  function _spawnConfetti() {
    const wrap = document.getElementById("confetti-wrap");
    wrap.innerHTML = "";
    const colors = [
      "#34d399",
      "#38bdf8",
      "#818cf8",
      "#fbbf24",
      "#f472b6",
      "#a78bfa",
    ];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
        animation-duration: ${1.2 + Math.random() * 1.8}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      wrap.appendChild(piece);
    }
    setTimeout(() => {
      wrap.innerHTML = "";
    }, 3000);
  }

  /* ----------------------------------------------------------------
     PERSISTENCE
  ---------------------------------------------------------------- */
  function _persist() {
    saveState({ score, currentLevel, currentQuestion, questionStatus });
  }

  /* ----------------------------------------------------------------
     PUBLIC API
  ---------------------------------------------------------------- */
  return {
    init,
    showWelcome,
    showLevelSelect,
    startFresh,
    resume,
    startLevel,
    submitAnswer,
    showAnswer,
    nextQuestion,
    prevQuestion,
  };
})();

/* ============================================================
   Bootstrap on DOM ready
=========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  App.init();

  // Allow pressing Enter in textarea to submit answer
  document
    .getElementById("answer-input")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        App.submitAnswer();
      }
    });
});

// Expose App to global scope for HTML onclick handlers
window.App = App;

