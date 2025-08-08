import { ContentCopy } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import './App.css';
import { useApi } from './hooks/useApi';
import { useAuth } from './hooks/useAuth';
import toast from 'react-hot-toast';
import AuthModal from './components/auth/AuthModal';
import UserDropdown from './components/auth/UserDropdown';

export default function App() {
  const {
    prompt,
    setPrompt,
    comment,
    setComment,
    response,
    history,
    loading: apiLoading,
    sendPrompt,
    sendComment,
    clearHistory,
  } = useApi();

  const { isAuthenticated, authChecked, loading: authLoading } = useAuth();

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    toast.success('Response copied to clipboard!');
  };

  if (!authChecked || authLoading) {
    return <div className="loading-container"><CircularProgress /></div>;
  }

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Generate Make JSON</h1>
        <UserDropdown />
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
            <button onClick={sendPrompt} disabled={apiLoading}>
              {apiLoading ? 'Sending...' : 'Send Prompt'}
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

            <button onClick={sendComment} disabled={apiLoading || !comment}>
              {apiLoading ? 'Sending...' : 'Send Comment'}
            </button>
          </div>
        </div>

        {response && (
          <div className="response-container">
            <div className="response-header">
              <p>{apiLoading ? <CircularProgress /> : 'Response from Gemini AI:'}</p>
              <button onClick={handleCopy} disabled={apiLoading}>
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
