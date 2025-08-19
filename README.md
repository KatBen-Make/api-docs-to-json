# API Doc to JSON (Gemini AI)

This project is a **React + Express + Vite** application that lets users paste API documentation and receive structured JSON, powered by **Google's Gemini API**.

---

## 📦 Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/), [Material-UI](https://mui.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), Docker
- **Authentication**: Session-based with `cookie-session`
- **UI**: [MUI Icons](https://mui.com/material-ui/material-icons/)
- **AI Model**: [Google Gemini API](https://ai.google.dev/)
- **Security**: HTTP-only cookies, CSRF protection, secure sessions

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KatBen-Make/api-docs-to-json.git
cd api-docs-to-json
```

### 2. Install dependencies
```bash
npm install
```
This installs dependencies for both client and server via root-level package.json.

### 3. Setup environment variables

Create a .env file in the project root:

```bash
# Server Configuration
SESSION_SECRET=your-very-secure-random-string-change-this-in-production
NODE_ENV=development
PORT=8080

# Frontend URL (for CORS in production)
FRONTEND_URL=https://your-frontend-domain.com

# API Keys
API_KEY=your_google_gemini_api_key_here
GEMINI_MODULE=gemini-2.5-flash
```

🔐 **Security Note**: Never commit .env files with secrets to version control. Use strong, random values for `SESSION_SECRET` in production.

### 4. Run the app in development
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### 5. Authentication
- Users must authenticate with a Make.com email and API token
- Only `@make.com` email addresses are allowed
- Sessions are managed securely with HTTP-only cookies
- Automatic session expiration after 24 hours

### 6. Docker Deployment
To build and run the application using Docker:
```bash
docker build -t api-docs-to-json .
docker run -p 8080:8080 -it api-docs-to-json
```
The application will be available at http://localhost:8080.

### ✨ Features

- **🔐 Secure Authentication**: Session-based auth with Make.com email validation
- **📝 API Documentation Processing**: Paste unstructured API docs and get structured JSON
- **🤖 AI-Powered**: Submit prompts to Gemini AI for intelligent processing
- **💬 Conversation History**: Add comments and maintain context across requests
- **📋 Copy-to-Clipboard**: Quick export functionality with MUI icons
- **🔄 Loading States**: Comprehensive loading spinners and visual feedback
- **🛡️ Security Features**: 
  - HTTP-only cookies prevent XSS attacks
  - CSRF protection with SameSite cookies
  - Secure session management
  - Input validation and sanitization
- **📱 Responsive Design**: Works on desktop and mobile devices
- **🚫 Input Protection**: Prevents modification during API processing

### 📁 Folder Structure
```
api-docs-to-json/
├── .env.example                  # Environment variables template
├── .gitignore
├── Dockerfile                    # Docker configuration
├── package.json                  # Root package.json (concurrent setup)
├── package-lock.json
├── README.md                     # This file
├── SECURITY.md                   # Security documentation
├──
├── client/                       # React frontend (Vite)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vite.config.js
│   └── src/
│       ├── App.css               # Main application styles
│       ├── App.jsx               # Main application component
│       ├── index.css
│       ├── main.jsx
│       ├── components/           # Reusable UI components
│       │   └── auth/
│       │       ├── AuthModal.jsx      # Login modal component
│       │       ├── AuthModal.css      # Login modal styles
│       │       ├── UserDropdown.jsx   # User menu component
│       │       └── UserDropdown.css   # User menu styles
│       ├── contexts/             # React context providers
│       │   ├── ApiContext.jsx          # API state context
│       │   ├── ApiProvider.jsx         # API state provider
│       │   ├── AuthContext.jsx         # Authentication context
│       │   └── AuthProvider.jsx        # Authentication provider
│       ├── hooks/                # Custom React hooks
│       │   ├── useApi.js              # API interaction hook
│       │   └── useAuth.js             # Authentication hook
│       └── services/             # API service functions
│           └── authService.js          # Authentication API calls
│
└── server/                       # Express backend
    ├── .dockerignore
    ├── index.js                  # Main server file
    ├── package.json
    ├── package-lock.json
    ├── data/                     # Markdown prompt templates
    │   ├── examples.md                # Example prompts for AI
    │   ├── generalPrompt.md           # Base AI instructions
    │   └── internalDocs.md            # Internal documentation
    └── src/
        └── routes/               # API route handlers
            └── auth.js                # Authentication routes
```

---

## 🔐 Security Features

This application implements enterprise-grade security practices:

- **Session-Based Authentication**: No sensitive data stored in localStorage
- **HTTP-Only Cookies**: Prevents XSS attacks by making sessions inaccessible to JavaScript
- **CSRF Protection**: SameSite cookie policy prevents cross-site request forgery
- **Secure Transport**: HTTPS-only cookies in production
- **Make.com Domain Restriction**: Only `@make.com` email addresses allowed
- **Session Expiration**: Automatic 24-hour timeout
- **Input Validation**: Server-side validation of all inputs

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

---

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - Authenticate with Make.com token
- `POST /api/auth/logout` - Destroy session
- `GET /api/auth/me` - Check authentication status

### Application
- `POST /api/data` - Process API documentation (requires authentication)

---

## 🛠️ Development

### Key Files to Edit
- `client/src/App.jsx` - Main application component
- `client/src/App.css` - Application styling
- `server/index.js` - Server configuration and main API endpoint
- `server/src/routes/auth.js` - Authentication logic
- `server/data/generalPrompt.md` - AI instructions
- `server/data/examples.md` - Example prompts for AI
- `server/data/internalDocs.md` - Internal documentation context

### Dependencies
#### Client
- React, Vite, Material-UI
- Custom hooks and context providers
- Hot toast notifications

#### Server  
- Express, cookie-session, axios
- CORS, dotenv, node-fetch

---

### To Do
- add option to add successful query to examples