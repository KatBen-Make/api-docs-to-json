import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [comment, setComment] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { prompt, comment } }),
      });
      const json = await res.json();
      const formatted = JSON.stringify(JSON.parse(json.response), null, 2);
      setResponse(formatted);
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <h1>Interact with Gemini AI</h1>

      <textarea
        placeholder="Paste parameters from API Documentation here..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <textarea
        placeholder="Add any comments here..."
        value={comment}
        onChange={e => setComment(e.target.value)}
      />

      <button onClick={sendPrompt} disabled={loading}>
        {loading ? 'Sending...' : 'Send Prompt'}
      </button>

      <div className="response-container">
        <div className="response-header">
          <p>Response from Gemini AI:</p>
          {response && (
            <button onClick={copyToClipboard} className="copy-btn" title="Copy JSON">
              📋 {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default App;
