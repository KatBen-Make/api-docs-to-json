# API Docs to JSON (Gemini AI)

This project is a **React + Express + Vite** application that lets users paste API documentation and receive structured JSON, powered by **Google's Gemini API**. Also using **docker**, **nginx**, **nodemon**.

---

## 📦 Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), Docker, Nginx
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
GEMINI_MODULE = gemini-2.0-flash
```
🔐 Never commit .env files with secrets to version control.

### 4. Run the app as dev
``` bash
npm run dev
```
Frontend: http://localhost:5173
Backend: http://localhost:5000

### 5. In Docker
Nginx: http://localhost
Frontend: http://localhost:3000
Backend: http://localhost:5000

### ✨ Features
- Paste unstructured API documentation
- Submit prompt to Gemini AI and receive structured JSON
- Copy-to-clipboard icon for fast export
- Editable output (planned)
- MUI icons

### 📁 Folder Structure
``` bash
api-docs-to-json
├── .env                          # Environment variables
├── .gitignore
├── client                        # React frontend (Vite)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── dist
│   │   ├── assets
│   │   └── index.html
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── docker-compose.yml             # Docker
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── package-lock.json
├── package.json                   # Project root (concurrent setup)
├── README.md                      # You're here
└── server                         # Express backend
    ├── .dockerignore
    ├── data                       # Markdown prompt templates
    │   ├── examples.md
    │   ├── generalPrompt.md
    │   └── internalDocs.md
    ├── Dockerfile
    ├── index.js
    ├── node_modules
    ├── package-lock.json
    └── package.json
```

### Files to edit

- client/src/App.css
- client/src/App.jsx
- server/index.js
- server/data/examples.md
- server/data/generalPrompt.md
- server/data/internalDocs.md

### To Do
- add option to add successful query to examples