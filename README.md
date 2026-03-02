# 🧠 Brain Challenge - تحدي العقول

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Questions-110-orange?style=for-the-badge" alt="Questions">
  <img src="https://img.shields.io/badge/Levels-5-red?style=for-the-badge" alt="Levels">
</p>

<p align="center">
  <strong>تحدي العقول</strong> - An interactive Arabic math and logic quiz application
</p>

**[Live Demo](https://salimov333.github.io/brain-challenge/)**

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [Scoring System](#scoring-system)
- [License](#license)

---

## Overview

Brain Challenge (تحدي العقول) is an engaging Arabic-language quiz application that tests your mathematical and logical reasoning skills across 5 progressive difficulty levels with 110 unique questions.

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
| **5 Difficulty Levels**  | Easy, Medium, Hard, Extreme, and Genius             |
| **110 Unique Questions** | Math, logic, sequences, geometry, and combinatorics |
| **Progress Persistence** | Your progress is saved automatically                |
| **Level Selection**      | Choose any level to start from                      |
| **Instant Feedback**     | Get immediate correct/incorrect feedback            |
| **Score Tracking**       | Earn 10 points per correct answer                   |
| **Celebration Effects**  | Confetti animation on correct answers               |
| **Answer Hints**         | Reveal answer with a 10-point penalty               |
| **Responsive Design**    | Works on desktop, tablet, and mobile                |

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
├── db.js          # Questions & metadata (ES Module)
├── questions.md   # Original questions source
└── README.md      # This file
```

---

## Getting Started

1. **Clone or download** the repository
2. **Open** `index.html` in a modern web browser
3. **Start playing** by clicking "ابدأ التحدي" (Start Challenge)

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

1. **Welcome Screen** - Click "ابدأ التحدي" to start or choose a specific level
2. **Read the Question** - Each question tests your math or logic skills
3. **Submit Your Answer** - Type your answer and press Enter or click "تحقق من الإجابة"
4. **Get Feedback** - Instant feedback shows if your answer is correct or wrong
5. **Progress Through Levels** - Complete questions to unlock harder levels

### Controls

| Button               | Action                        |
| -------------------- | ----------------------------- |
| ابدأ التحدي          | Start fresh game              |
| متابعة               | Resume saved game             |
| اختر المستوى         | Select specific level         |
| تحقق من الإجابة      | Submit your answer            |
| اعرض الإجابة الصحيحة | Show correct answer (penalty) |
| السابق / التالي      | Navigate questions            |

---

## Scoring System

- **+10 points** for each correct answer
- **-10 points** for each wrong answer
- **-10 points** for revealing the answer

### Performance Tiers

| Score   | Title                          |
| ------- | ------------------------------ |
| 800+    | 🌟 أسطوري (Legendary)          |
| 500-799 | 🏆 ممتاز (Excellent)           |
| 200-499 | 🥈 جيد جداً (Very Good)        |
| 0-199   | 🧠 شكراً للمشاركة (Good Start) |

---

## Question Levels

| Level | Name           | Questions | Range  |
| ----- | -------------- | --------- | ------ |
| 1     | سهل (Easy)     | 20        | 1-20   |
| 2     | متوسط (Medium) | 30        | 21-50  |
| 3     | صعب (Hard)     | 25        | 51-75  |
| 4     | شديد (Extreme) | 15        | 76-90  |
| 5     | عبقري (Genius) | 20        | 91-110 |

---

## License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ for math and logic enthusiasts
</p>
