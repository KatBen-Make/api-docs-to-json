import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/login', async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const response = await axios.get('https://eu1.make.com/api/v2/users/me', {
            headers: {
                Authorization: `Token ${token}`
            }
        });
        const { email } = response.data.authUser;
        if (!email.endsWith('@make.com')) {
            return res.status(403).json({ error: 'Access denied. Only make.com users are allowed.' });
        }

        // Store user data in session instead of sending it back
        const { id, name } = response.data.authUser;
        req.session.user = { id, name, email };

        // Only return success status - user data is now in session
        res.json({ success: true, user: { id, name, email } });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                error: 'Authentication failed',
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ error: 'No response from Make.com API' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    req.session = null; // Clear the session
    res.json({ success: true, message: 'Logged out successfully' });
});

// Check authentication status
router.get('/me', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    res.json({ user: req.session.user });
});

export default router;
