# SkillMatch Pro

**SkillMatch Pro** is a browser-based conversational AI app for:

- Analyzing uploaded CVs (PDF, DOCX, TXT)
- Applying business rules (e.g., “Recommend PMP only if 5+ years of experience”)
- Recommending training & certifications from a predefined catalog
- Chatting with an AI assistant about skills, training paths, and certifications

Everything runs **client-side** except the calls to **Google Gemini** for AI.

---

## 🧱 Tech Stack

- **Frontend**: HTML + vanilla JS + CSS  
- **AI**: Google Gemini API (`gemini-2.5-flash-preview-09-2025`)  
- **File Parsing**:
  - [PDF.js](https://mozilla.github.io/pdf.js/) for PDF text extraction
  - [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for DOCX parsing
- **Storage**:
  - `localStorage` for:
    - Chat history
    - Certificate catalog
  - Business rules handled via the model (in memory only)

---

## 📂 Project Structure

Recommended folder structure:

skillmatch-pro/
├─ index.html # Main frontend page
├─ app.js # All application logic (AI, parsing, rules, UI)
├─ css/
│ └─ styles.css # Styling
├─ config.js # Injects GEMINI_API_KEY into window.GEMINI_API_KEY
├─ .env # Your environment variable storage (ignored by Git)
├─ .gitignore # Ensures .env is not committed
└─ README.md # Documentation file




