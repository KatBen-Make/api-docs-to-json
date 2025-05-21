import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// to work with files in the same directory (index.html)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname)));

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

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
app.post('/api/data', async (req, res) => {
    try {
        const { data } = req.body;  // Get the "data" object
        const { prompt, comment = "return json" } = data;    // Extract "prompt" from the "data" object


        const requestBody = {
            contents: [
                {
                    role: 'model',
                    parts: [
                        {
                            text: generateSystemPrompt()
                        },
                    ],
                },
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        },
                    ],
                },
                { //add a new object to the contents array
                    role: "user",
                    parts: [
                        {
                            text: "convert to JSON" //comment,
                        },
                    ],
                },
            ],
        };
        console.log("Request Body:", JSON.stringify(requestBody, null, 2));

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
        // console.log("Result Body:", JSON.stringify(result, null, 2));

        // Extract the text from the response
        let responseText = "";
        if (result && result.candidates && result.candidates[0] &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts[0] && result.candidates[0].content.parts[0].text) {
            responseText = result.candidates[0].content.parts[0].text;
        }
        res.json({ response: responseText }); // Send only the extracted text

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Microservice listening on port ${process.env.PORT || 5000}`);
});