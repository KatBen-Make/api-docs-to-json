import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import './AuthModal.css';
import { useAuth } from '../../hooks/useAuth';

const AuthModal = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.endsWith('@make.com')) {
            setError('Invalid email domain. Please use a make.com email.');
            return;
        }

        try {
            await login(email, token);
        } catch (err) {
            setError(err.message || 'Failed to authenticate. Please check your email and token.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login</h2>
                <p>Please enter your Make.com email and API token.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="token">Token</label>
                        <input
                            type="password"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <CircularProgress size={16} sx={{ marginRight: 1 }} />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
