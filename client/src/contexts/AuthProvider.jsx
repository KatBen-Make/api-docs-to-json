import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
import { loginWithToken } from '../services/authService';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const login = useCallback(async (email, token) => {
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
            login(storedEmail, storedToken).finally(() => {
                setAuthChecked(true);
            });
        } else {
            setAuthChecked(true);
        }
    }, [login]);

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authEmail');
        toast.success('Successfully logged out!');
    };

    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        authChecked,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
