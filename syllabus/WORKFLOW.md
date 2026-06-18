# Syllabus-Based Question Generation Workflow

Because you want to generate high-quality objective questions from your PDF syllabus files, the easiest and most effective method is to use a large language model (like Gemini, ChatGPT, or Claude) with a standardized prompt.

## How to Generate the Question Bank

1. Open your AI assistant (e.g., Gemini Advanced).
2. Upload your syllabus file (e.g., `php-syllabus.pdf`).
3. Copy and paste the **System Prompt** below into the chat.
4. The AI will output a perfectly formatted JSON array.
5. Save the output directly as `data/<subject>.json` (e.g., `data/php.json`).

---

## 📋 Standardized Prompt

Copy everything in the block below:

```text
You are an expert exam setter for the MPSEDC GET 3.0 objective exams.
I have attached the syllabus for a subject.

Your task is to generate a comprehensive, high-quality MCQ question bank covering all topics in the syllabus.

### Requirements:
1. Generate at least 50 questions from the attached syllabus.
2. Focus on:
   - Core Concepts and Definitions
   - Differences and Comparisons
   - Syntax and Language Rules
   - Practical, real-world scenarios
   - Frequently asked MCQ patterns for screening tests
3. AVOID overly academic, university-style long-theory questions. Keep them objective and crisp.
4. Distribute the questions evenly across the topics mentioned in the syllabus.
5. Questions level should be easy and medium. Not hard

### Output Format:
You MUST output ONLY a valid JSON array. Do not include any markdown formatting blocks like ```json or trailing text. The format for each question object must be EXACTLY as follows:

[
  {
    "id": 1, // Must be unique integer
    "topic": "Name of the topic from syllabus",
    "question": "The question text?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": 0, // Integer index (0-3) of the correct option
    "explanation": "A clear, concise explanation of why the answer is correct."
  }
]
```

---

## 🛠️ Adding the Generated File to the Platform

1. Copy the JSON output from the AI.
2. Go to the `public/data/` folder in this project.
3. Create a new file (e.g., `software-engineering.json`).
4. Paste the JSON into the file and save.
5. Open `src/utils/questionLoader.ts` and ensure the new subject name is added to the `getAvailableSubjects()` list if you want it to appear automatically.

*Note: If you have a very large syllabus, you can ask the AI to "Generate 50 more questions for the remaining topics" and simply append the objects to your JSON array.*
