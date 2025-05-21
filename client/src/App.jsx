import React, { useState } from 'react';
import { ContentCopy } from '@mui/icons-material';
import './App.css';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [comment, setComment] = useState('');
  const [response, setResponse] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { prompt, comment } }),
      });
      const json = await res.json();
      setResponse(json.response);
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
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

      <textarea
        placeholder="Paste parameters from API Documentation here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
      />

      <textarea
        placeholder="Add any comments here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
      />

      <button onClick={sendPrompt} disabled={loading}>
        {loading ? 'Sending...' : 'Send Prompt'}
      </button>

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
  );
}
// This code is a React component that allows users to interact with the Gemini AI API. It includes a text area for users to input parameters, a button to send the prompt, and a section to display the response. The response is formatted as JSON for better readability, and there are options to copy the response to the clipboard. The component also handles loading states and error messages.
// The component uses Material UI icons for the copy button and includes basic styling for layout and appearance. The response is displayed in a preformatted text block to maintain the JSON structure.
