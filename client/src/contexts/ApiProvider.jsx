import React, { useState, useEffect, useCallback } from 'react';
import { ApiContext } from './ApiContext';
import toast from 'react-hot-toast';
import { loginWithToken } from '../services/authService';

export const ApiProvider = ({ children }) => {
    const [prompt, setPrompt] = useState('');
    const [comment, setComment] = useState('');
    const [response, setResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const handleLogin = useCallback(async (email, token) => {
        setLoading(true);
        try {
            const userData = await loginWithToken(token);
            if (userData.authUser.email !== email) {
                throw new Error('Email does not match the token.');
            }
            setUser(userData.authUser);
            setToken(token);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', token);
            localStorage.setItem('authEmail', email);
            toast.success('Successfully logged in!');
        } catch (error) {
            toast.error(String(error));
            console.error(error);
            // Clear invalid token from storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('authEmail');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedEmail = localStorage.getItem('authEmail');
        if (storedToken && storedEmail) {
            handleLogin(storedEmail, storedToken).finally(() => {
                setAuthChecked(true);
            });
        } else {
            setAuthChecked(true);
        }
    }, [handleLogin]);

    const logout = () => {
// ... existing code ...
        localStorage.removeItem('authEmail');
        toast.success('Successfully logged out!');
    };

    const sendApiRequest = async (input) => {
        setLoading(true);
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { ...input, history } }),
            });

            const {
                responseText,
                updatedHistory,
                error,
                details,
            } = await response.json();

            if (!response.ok) {
                toast.error(<span><b>{error}</b><br />{details}</span>);
                return;
            }

            setResponse(responseText);
            setHistory(updatedHistory);
        } catch (error) {
            toast.error(String(error));
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendPrompt = async () => {
        await sendApiRequest({ prompt });
    };

    const sendComment = async () => {
        if (!comment.trim()) return;
        await sendApiRequest({ prompt, comment });
        setComment('');
    };

    const clearHistory = () => {
// ... existing code ...
        setComment('');
    };

    const value = {
        prompt,
        setPrompt,
        comment,
        setComment,
        response,
        history,
        loading,
        sendPrompt,
        sendComment,
        clearHistory,
        user,
        isAuthenticated,
        login: handleLogin,
        logout,
        authChecked,
    };

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
