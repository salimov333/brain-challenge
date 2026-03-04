# 🧠 Brain Challenge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Questions-110-orange?style=for-the-badge" alt="Questions">
  <img src="https://img.shields.io/badge/Levels-5-red?style=for-the-badge" alt="Levels">
</p>

<p align="center">
  An interactive math and logic quiz application
</p>

**[Live Demo](https://salimov333.github.io/brain-challenge/)**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Multi-Language Support](#multi-language-support)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Scoring System](#scoring-system)
- [Question Levels](#question-levels)
- [License](#license)

---

## Overview

Brain Challenge is an engaging multi-language quiz application that tests your mathematical and logical reasoning skills across 5 progressive difficulty levels with 110 unique questions.

The app features:

- 📊 Progress tracking with localStorage persistence
- 🎯 Multiple difficulty levels from easy to genius
- 🎨 Beautiful dark theme with animations
- 📱 Responsive design for all devices
- 🏆 Score system with celebration effects

---

## Features

| Feature                  | Description                                         |
| ------------------------ | --------------------------------------------------- |
| **Multi-Language Support** | English (default), German, Arabic with RTL support |
| **5 Difficulty Levels**  | Easy, Medium, Hard, Extreme, and Genius             |
| **110 Unique Questions** | Math, logic, sequences, geometry, and combinatorics |
| **Progress Persistence** | Your progress is saved automatically               |
| **Level Selection**     | Choose any level to start from                     |
| **Instant Feedback**     | Get immediate correct/incorrect feedback           |
| **Score Tracking**       | Earn 10 points per correct answer                  |
| **Celebration Effects**  | Confetti animation on correct answers              |
| **Answer Hints**        | Reveal answer with a 10-point penalty             |
| **Responsive Design**   | Works on desktop, tablet, and mobile               |

---

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, responsive design
- **JavaScript (ES6+)** - ES Modules, modern JS features
- **Google Fonts** - Tajawal & Cairo fonts

---

## Project Structure

```
brain-challenge/
├── index.html      # Main HTML file
├── style.css      # All CSS styles
├── app.js         # Application logic (ES Module)
├── i18n.js        # Internationalization (i18n) module
├── db.js          # Questions & metadata (ES Module)
├── test.js        # Testing script for validating answers
├── README.md      # This file
└── locales/       # Translation files
    ├── en.json    # English translations
    ├── ar.json    # Arabic translations
    └── de.json    # German translations
```

---

## Multi-Language Support

Brain Challenge supports **3 languages**:
- 🇬🇧 **English** (default)
- 🇩🇪 **German (Deutsch)**
- 🇸🇦 **Arabic (العربية)** with full RTL (right-to-left) support

### Language Features:
- Dynamic text direction based on selected language
- All UI elements, questions, and feedback are translated
- Language preference is saved in localStorage
- Switch languages anytime using the dropdown in the top-right corner

### How It Works:
The `i18n.js` module handles:
- Loading translation files from `locales/` directory
- Applying translations to all UI elements with `data-i18n` attributes
- Setting document direction (`dir="rtl"` for Arabic, `dir="ltr"` for English/German)
- Persisting language preference across sessions

---

## Testing Script

This project includes a testing script to validate that all questions have matching answers.

### Run Tests

**Node.js:**
```bash
node test.js
```

**Browser:**
1. Open `index.html` in a browser
2. Open Developer Console (F12)
3. Run:
```javascript
import('./test.js').then(m => m.printTestResults());
```

The test validates all 110 questions and outputs results to the console.

---

## Getting Started

1. **Clone or download** the repository
2. **Open** `index.html` in a modern web browser
3. **Start playing** by clicking "Start Challenge"

> **Note:** This app uses ES Modules, so you may need to serve it via a local server instead of opening the file directly. Use one of these methods:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Using VS Code Live Server extension
```

---

## How to Play

1. **Welcome Screen** - Click "Start Challenge" to begin or choose a specific level
2. **Read the Question** - Each question tests your math or logic skills
3. **Submit Your Answer** - Type your answer and press Enter or click "Check Answer"
4. **Get Feedback** - Instant feedback shows if your answer is correct or wrong
5. **Progress Through Levels** - Complete questions to unlock harder levels

### Controls

| Button          | Action                        |
| --------------- | ----------------------------- |
| Start Challenge | Start fresh game              |
| Resume          | Resume saved game             |
| Select Level    | Select specific level         |
| Check Answer    | Submit your answer            |
| Show Answer     | Show correct answer (penalty) |
| Previous/Next   | Navigate questions            |

---

## Scoring System

- **+10 points** for each correct answer
- **-10 points** for each wrong answer
- **-10 points** for revealing the answer

### Performance Tiers

| Score   | Title      |
| ------- | ---------- |
| 800+    | 🌟 Legendary |
| 500-799 | 🏆 Excellent |
| 200-499 | 🥈 Very Good |
| 0-199   | 🧠 Good Start |

---

## Question Levels

| Level | Name      | Questions | Range  |
| ----- | --------- | --------- | ------ |
| 1     | Easy      | 20        | 1-20   |
| 2     | Medium    | 30        | 21-50  |
| 3     | Hard      | 25        | 51-75  |
| 4     | Extreme   | 15        | 76-90  |
| 5     | Genius    | 20        | 91-110 |

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for math and logic enthusiasts
</p>

