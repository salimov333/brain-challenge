
/* ============================================================
   TESTING SCRIPT – Developer Tool
   Validates that all questions have matching answers
   
   USAGE:
   - Node.js:    node test.js
   - Browser:    Open browser console and run:
                 import('./test.js').then(m => m.printTestResults());
=========================================================== */

// Detect if we're in Node.js (check for process.versions)
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

// Expected solutions for each level (English level names)
const SOLUTIONS = {
  Easy: [
    "80", "12", "12", "13", "8", "18", "64", "210", "7", "162",
    "63", "14", "9", "8", "25", "9", "10", "110", "36", "31",
  ],
  Medium: [
    "15", "60", "17", "10", "275", "144", "25", "6", "125", "26",
    "6", "8", "9", "12", "30", "48", "15", "1080", "8", "6",
    "8", "12", "24", "9", "15", "1275", "35", "65", "36", "10",
  ],
  Hard: [
    "225", "120", "720", "9", "29", "35", "465", "10", "152", "49",
    "360", "12", "33", "54", "35", "8", "60", "27", "1683", "70",
    "780", "720", "10", "24", "45",
  ],
  Extreme: [
    "441", "5040", "126", "31", "5050", "62", "170", "2040", "41", "720",
    "24", "150", "12", "122", "252",
  ],
  Genius: [
    "40320", "924", "385", "784", "111", "1175", "53", "15120", "243", "2500",
    "243", "16", "15", "540", "190", "1000", "35350", "362880", "990", "10",
  ],
};

let LEVELS = null;

/**
 * Load levels from JSON - works in both Node.js and browser
 */
async function loadLevels() {
  if (LEVELS) return LEVELS;
  
  if (isNode) {
    // Node.js: use dynamic import to avoid bundler issues
    const { readFileSync } = await import('fs');
    const enData = JSON.parse(readFileSync('./locales/en.json', 'utf-8'));
    LEVELS = enData.questionsData;
  } else {
    // Browser: fetch from server
    const response = await fetch('./locales/en.json');
    const enData = await response.json();
    LEVELS = enData.questionsData;
  }
  return LEVELS;
}

/**
 * Run all tests and return results
 */
export function runTests() {
  if (!LEVELS) {
    return { totalQuestions: 0, passed: 0, failed: 1, errors: [{ error: "Levels not loaded. Call loadLevels() first." }] };
  }
  
  const results = {
    totalQuestions: 0,
    passed: 0,
    failed: 0,
    errors: [],
  };

  LEVELS.forEach((level) => {
    level.questions.forEach((qObj, index) => {
      results.totalQuestions++;
      const correctAnswer = SOLUTIONS[level.name]?.[index];
      
      if (!correctAnswer) {
        results.failed++;
        results.errors.push({
          level: level.name,
          questionNum: index + 1,
          error: "No expected answer defined",
        });
        return;
      }

      if (qObj.a === correctAnswer) {
        results.passed++;
      } else {
        results.failed++;
        results.errors.push({
          level: level.name,
          questionNum: index + 1,
          question: qObj.q.substring(0, 50) + "...",
          expected: correctAnswer,
          got: qObj.a,
        });
      }
    });
  });

  return results;
}

/**
 * Print test results to console
 */
export async function printTestResults() {
  console.clear();
  console.log("🧪 Running Brain Challenge Tests...\n");
  
  await loadLevels();
  const results = runTests();
  
  if (results.failed === 0) {
    console.log(`✅ All ${results.totalQuestions} tests passed!`);
  } else {
    console.log(`❌ Test Results: ${results.passed}/${results.totalQuestions} passed, ${results.failed} failed\n`);
    
    results.errors.forEach((err) => {
      console.log(`❌ Level: ${err.level}, Question ${err.questionNum}:`);
      if (err.error) {
        console.log(`   Error: ${err.error}`);
      } else {
        console.log(`   Q: ${err.question}`);
        console.log(`   Expected: ${err.expected}, Got: ${err.got}`);
      }
      console.log("");
    });
  }
  
  return results;
}

// Auto-run if in Node.js
if (isNode) {
  printTestResults();
}

export default { runTests, printTestResults, loadLevels };

