# API Docs to JSON (Gemini AI)

This project is a **React + Express** application that lets users paste API documentation and receive structured JSON, powered by **Google's Gemini API**.

---

## 📦 Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **UI**: [MUI Icons](https://mui.com/material-ui/material-icons/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/api-docs-to-json.git
cd api-docs-to-json
```

### 2. Install dependencies
```bash
npm install
```
This installs dependencies for both client and server via root-level package.json.

### 3. Setup environment variables

Create a .env file in the project root:

```
PORT=5000
API_KEY=your_google_gemini_api_key_here
```
🔐 Never commit .env files with secrets to version control.

### 4. Run the app
``` bash
npm run dev
```
Frontend: http://localhost:5173
Backend: http://localhost:5000

### ✨ Features
- Paste unstructured API documentation
- Submit prompt to Gemini AI and receive structured JSON
- Copy-to-clipboard icon for fast export
- Editable output (planned)
- MUI icons

### 📁 Folder Structure
``` bash
api-docs-to-json/
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── data/            # Markdown prompt templates
├── .env             # Environment variables
├── package.json     # Project root (concurrent setup)
└── README.md        # You're here
```

### Files to edit

- client/src/App.css
- client/src/App.jsx
- server/index.js
- server/data/examples.md
- server/data/generalPrompt.md
- server/data/internalDocs.md

### To Do
- add option for Title case fro labels (Sentence case is default)
- add option to add successful query to examples
- add conversation with the AI