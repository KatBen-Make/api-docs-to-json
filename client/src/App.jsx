import React, { useState, useEffect } from 'react';
import { ContentCopy } from '@mui/icons-material';
import './App.css';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [comment, setComment] = useState('');
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setHistory([]);
    setResponse('');
  }, []);

  const sendPrompt = async () => {
    setLoading(true);

    const payload = {
      data: {
        prompt,
        comment,
        history,
      },
    };
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { prompt, comment, history } }),
      });
      const json = await res.json();
      setResponse(json.response);

      // Append new user + model messages to history
      setHistory([
        ...history,
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: json.response }] }
      ]);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const sendComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    const newHistory = [
      ...history,
      { role: 'user', parts: [{ text: comment }] }
    ];

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { prompt, comment, history: newHistory } }),
      });
      const json = await res.json();
      setResponse(json.response);

      // Update history with new comment and AI reply
      setHistory([
        ...newHistory,
        { role: 'model', parts: [{ text: json.response }] }
      ]);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setComment('');
    setLoading(false);
  };

  const handleCopy = () => {
    let cleanCopy = response.replace(/^```json\s*/, '').replace(/```$/, '');
    navigator.clipboard.writeText(cleanCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Try to pretty format JSON response or fallback to plain text
  let prettyResponse = response.replace('```json', '').replace('```', '').split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
  try {
    prettyResponse = JSON.stringify(JSON.parse(response), null, 2);
  } catch {
    // Not valid JSON, keep as-is
  }

  return (
    <div className="container">
      <h1>Generate Make JSON</h1>
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
            <button onClick={() => setHistory([])} style={{ marginLeft: '1rem' }}>
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
              <p>Response from Gemini AI:</p>
              <ContentCopy
                className={`copy-icon ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? 'Copied!' : 'Copy JSON'}
              />
            </div>
            <pre className="json-display">{prettyResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
// This code is a React component that allows users to interact with the Gemini AI API. It includes a text area for users to input parameters, a button to send the prompt, and a section to display the response. The response is formatted as JSON for better readability, and there are options to copy the response to the clipboard. The component also handles loading states and error messages.
// The component uses Material UI icons for the copy button and includes basic styling for layout and appearance. The response is displayed in a preformatted text block to maintain the JSON structure.
