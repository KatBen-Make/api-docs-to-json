import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';
import { loginWithToken, logout as logoutService, getCurrentUser } from '../services/authService';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const login = useCallback(async (email, token) => {
        setLoading(true);
        try {
            const response = await loginWithToken(token);
            if (response.user.email !== email) {
                throw new Error('Email does not match the token.');
            }
            setUser(response.user);
            setIsAuthenticated(true);
            toast.success('Successfully logged in!');
        } catch (error) {
            toast.error(String(error));
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check if user is already authenticated on app load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await getCurrentUser();
                if (response && response.user) {
                    setUser(response.user);
                    setIsAuthenticated(true);
                }
            } catch {
                // User is not authenticated, which is fine
                console.log('User not authenticated');
            } finally {
                setAuthChecked(true);
            }
        };
        
        checkAuth();
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutService();
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Successfully logged out!');
        } catch (error) {
            toast.error('Logout failed');
            console.error(error);
            // Even if logout fails on server, clear local state
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

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
