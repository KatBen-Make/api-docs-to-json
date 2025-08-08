import React, { useState } from 'react';
import { ApiContext } from './ApiContext';
import toast from 'react-hot-toast';

export const ApiProvider = ({ children }) => {
    const [prompt, setPrompt] = useState('');
    const [comment, setComment] = useState('');
    const [response, setResponse] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendPrompt = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { prompt, comment, history } }),
            });

            const {
                responseText,
                updatedHistory,
                error,
                details,
            } = await response.json();

            if (!response.ok) {
                toast.error((<span><b>{error}</b><br />{details}</span>));
                setLoading(false);
                return;
            }

            setResponse(responseText);
            setHistory(updatedHistory);
        } catch (error) {
            toast.error(String(error));
            console.error(error);
        }
        setLoading(false);
    };

    const sendComment = async () => {
        if (!comment.trim()) return;
        setLoading(true);

        try {
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { prompt, comment, history } }),
            });

            const {
                responseText,
                updatedHistory,
                error,
                details,
            } = await response.json();

            if (!response.ok) {
                toast.error((<span><b>{error}</b><br />{details}</span>));
                setLoading(false);
                return;
            }

            setResponse(responseText);
            setHistory(updatedHistory);
        } catch (error) {
            toast.error(String(error));
            console.error(error);
        }
        setComment('');
        setLoading(false);
    };

    const clearHistory = () => {
        setHistory([]);
        setResponse('');
        setPrompt('');
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
    };

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};
