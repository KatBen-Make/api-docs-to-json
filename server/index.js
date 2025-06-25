import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const registeredRoutes = [];
app.use(cors()); // Enables CORS for all routes

// Middleware to parse JSON bodies
app.use(express.json());

// to work with files in the same directory (index.html)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Gemini module from environment variable or use default
const geminiModule = process.env.GEMINI_MODULE || 'gemini-2.0-flash';

const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModule}:generateContent`;

// Basic error handling function
function handleErrors(response) {
    if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
        });
    }
    return response;
};

// Cache internal docs
let internalDocumentation = '';
let examples = '';
let generalPrompt = ''

// Load internal documentation
try {
    internalDocumentation = fs.readFileSync(
        path.join(__dirname, './data/internalDocs.md'),
        'utf8'
    );
    examples = fs.readFileSync(
        path.join(__dirname, './data/examples.md'),
        'utf8'
    );
    generalPrompt = fs.readFileSync(
        path.join(__dirname, './data/generalPrompt.md'),
        'utf8'
    );
    console.log('✅ Internal documentation, examples and general prompt loaded successfully');

} catch (error) {
    console.error('❌ Error loading internal documentation:', error);
    internalDocumentation = 'Failed to load internal documentation.';
    examples = 'Failed to load examples.';
    process.exit(1); // Stop the server from starting if critical files are missing
}

function generateSystemPrompt() {
    return `${generalPrompt}
  
  INTERNAL DOCUMENTATION:
  ${internalDocumentation}
  
  Examples:
  ${examples}`

};

// Route to interact with the Gemini Pro API
registeredRoutes.push({ method: 'POST', path: '/api/data' });
app.post('/api/data', async (req, res) => {
    try {
        const { data } = req.body;
        const { prompt, comment = '', history = [] } = data;

        const currentInput = comment || prompt;

        const requestBody = {
            contents: [
                { role: 'model', parts: [{ text: generateSystemPrompt() }] },
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

        const response = await fetch(API_ENDPOINT, requestOptions)
            .then(handleErrors);

        const result = await response.json();

        let responseText = "";
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
            responseText = result.candidates[0].content.parts[0].text;
        }

        // Append the user's latest input (prompt or comment)
        const updatedHistory = [
            ...history,
            { role: 'user', parts: [{ text: currentInput }] },
            { role: 'model', parts: [{ text: responseText }] }
        ];

        res.json({ response: responseText, history: updatedHistory });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Microservice listening on port ${process.env.PORT || 5000}`);
});