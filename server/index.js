import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

// to work with files in the same directory (index.html)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors()); // Enables CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Get Gemini module from environment variable or use default
const geminiModule = process.env.GEMINI_MODULE ?? 'gemini-2.0-flash';

const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModule}:generateContent`;

// Load internal documentation 
let systemPrompt = '';
try {
    const internalDocumentation = fs.readFileSync(
        path.join(__dirname, './data/internalDocs.md'),
        'utf8'
    );
    const examples = fs.readFileSync(
        path.join(__dirname, './data/examples.md'),
        'utf8'
    );
    const generalPrompt = fs.readFileSync(
        path.join(__dirname, './data/generalPrompt.md'),
        'utf8'
    );
    console.log('✅ Internal documentation, examples and general prompt loaded successfully');

    systemPrompt = `${generalPrompt}

    INTERNAL DOCUMENTATION:
    ${internalDocumentation}

    Examples:
    ${examples}`;
} catch (error) {
    console.error('❌ Error loading internal documentation:', error);
    process.exit(1); // Stop the server from starting if critical files are missing
}

// Route to interact with the Gemini Pro API
app.post('/api/data', async (req, res) => {
    const { data } = req.body;
    const { prompt, comment = '', history = [] } = data;

    const currentInput = comment || prompt;

    const requestBody = {
        contents: [
            { role: 'model', parts: [{ text: systemPrompt }] },
            ...history,
            { role: 'user', parts: [{ text: currentInput }] }
        ],
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.API_KEY,
        },
        body: JSON.stringify(requestBody),
    };

    let responseText = '';
    try {
        const response = await fetch(API_ENDPOINT, requestOptions);
        const result = await response.json();
        if (!response.ok) {
            res.status(400).json({ error: 'Error fetching from Gemini API', details: result.error.message });
            return;
        }
        responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error });
        return;
    }

    // Append the user's latest input (prompt or comment)
    const updatedHistory = [
        ...history,
        { role: 'user', parts: [{ text: currentInput }] },
        { role: 'model', parts: [{ text: responseText }] }
    ];

    res.json({ responseText, updatedHistory });
});

// Serve static files from the React app after API routes
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/{*any}', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
        return;
    }
    return next(); // Let the development server handle this in development mode
});

app.listen(process.env.PORT ?? 8080, () => {
    console.log(`✅ Microservice listening on port ${process.env.PORT ?? 8080}`);
});