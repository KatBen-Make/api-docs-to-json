import { ContentCopy } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import './App.css';
import { useApi } from './hooks/useApi';
import toast from 'react-hot-toast';
import AuthModal from './components/auth/AuthModal';

export default function App() {
  const {
    prompt,
    setPrompt,
    comment,
    setComment,
    response,
    history,
    loading,
    sendPrompt,
    sendComment,
    clearHistory,
    isAuthenticated,
    logout,
    user,
    authChecked,
  } = useApi();

  const handleCopy = () => {
// ... existing code ...
    navigator.clipboard.writeText(response);
    toast.success('Response copied to clipboard!');
  };

  if (!authChecked) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Generate Make JSON</h1>
        <div className="user-info">
          {user && <span>Welcome, {user.name}</span>}
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </div>
      <h3>Convert API documentation to MAKE mappable parameters with Gemini AI</h3>
      <div className="flex-layout">
        {/* Left side: Inputs */}
        <div className="input-section">
          <textarea
            placeholder="Paste parameters from API Documentation here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
          />
          <div className="button-wrapper">
            <button onClick={sendPrompt} disabled={loading}>
              {loading ? 'Sending...' : 'Send Prompt'}
            </button>
          </div>
          {/* Show previous user comments */}
          <div className="conversation-history">
            {history
              .filter(entry => entry.role === 'user' && entry.parts[0]?.text !== prompt)
              .map((entry, i) => (
                <div key={i} className="comment-entry">💬 {entry.parts[0]?.text}</div>
              ))}
          </div>

          <textarea
            placeholder="Add any comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
          />
          <div className="button-wrapper">
            <button onClick={clearHistory} style={{ marginLeft: '1rem' }}>
              Clear History
            </button>

            <button onClick={sendComment} disabled={loading || !comment}>
              {loading ? 'Sending...' : 'Send Comment'}
            </button>
          </div>
        </div>

        {response && (
          <div className="response-container">
            <div className="response-header">
              <p>{loading ? <CircularProgress /> : 'Response from Gemini AI:'}</p>
              <button onClick={handleCopy} disabled={loading}>
                <ContentCopy />
              </button>
            </div>
            <pre className="json-display">{response}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
// This code is a React component that allows users to interact with the Gemini AI API. It includes a text area for users to input parameters, a button to send the prompt, and a section to display the response. The response is formatted as JSON for better readability, and there are options to copy the response to the clipboard. The component also handles loading states and error messages.
// The component uses Material UI icons for the copy button and includes basic styling for layout and appearance. The response is displayed in a preformatted text block to maintain the JSON structure.
