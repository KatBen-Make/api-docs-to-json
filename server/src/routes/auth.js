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
        res.json(response.data);
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
