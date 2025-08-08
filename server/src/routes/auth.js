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

        // Only return necessary user fields to the client
        const { id, name } = response.data.authUser;
        res.json({ authUser: { id, name, email } });
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

export default router;
