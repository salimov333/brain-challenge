/* ============================================================
   TESTING SCRIPT – Developer Tool
   Validates that all questions have matching answers
   
   USAGE:
   - Node.js:    node test.js
   - Browser:    Import this file in console:
                 import('./test.js').then(m => m.printTestResults()); 
                 or add <script type="module" src="test.js"></script> to HTML
=========================================================== */
import { LEVELS } from './db.js';

// Expected solutions for each level
const SOLUTIONS = {
  سهل: [
    "80",
    "12",
    "12",
    "13",
    "8",
    "18",
    "64",
    "210",
    "7",
    "162",
    "63",
    "14",
    "9",
    "8",
    "25",
    "9",
    "10",
    "110",
    "36",
    "31",
  ],
  متوسط: [
    "15",
    "60",
    "17",
    "10",
    "275",
    "144",
    "25",
    "6",
    "125",
    "26",
    "6",
    "8",
    "9",
    "12",
    "30",
    "48",
    "15",
    "1080",
    "8",
    "6",
    "8",
    "12",
    "24",
    "9",
    "15",
    "1275",
    "35",
    "65",
    "36",
    "10",
  ],
  صعب: [
    "225",
    "120",
    "720",
    "9",
    "29",
    "35",
    "465",
    "10",
    "152",
    "49",
    "360",
    "12",
    "33",
    "54",
    "35",
    "8",
    "60",
    "27",
    "1683",
    "70",
    "780",
    "720",
    "10",
    "24",
    "45",
  ],
  شديد: [
    "441",
    "5040",
    "126",
    "31",
    "5050",
    "62",
    "170",
    "2040",
    "41",
    "720",
    "24",
    "150",
    "12",
    "122",
    "252",
  ],
  عبقري: [
    "40320",
    "924",
    "385",
    "784",
    "111",
    "1175",
    "53",
    "15120",
    "243",
    "2500",
    "243",
    "16",
    "15",
    "540",
    "190",
    "1000",
    "35350",
    "362880",
    "990",
    "10",
  ],
};

/**
 * Run all tests and return results
 * @returns {Object} Test results with pass/fail status and details
 */
export function runTests() {
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
export function printTestResults() {
  console.clear();
  console.log("🧪 Running Brain Challenge Tests...\n");
  
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

// Auto-run if executed directly (Node.js or browser console)
if (typeof window !== 'undefined' || typeof process !== 'undefined') {
  // Run tests immediately when imported
  printTestResults();
}

export default { runTests, printTestResults };

