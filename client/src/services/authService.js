export const loginWithToken = async (token) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in requests
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.message || 'Authentication failed. Please check your token.');
    }

    return response.json();
};

export const logout = async () => {
    const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }

    return response.json();
};

export const getCurrentUser = async () => {
    const response = await fetch('/api/auth/me', {
        credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
        if (response.status === 401) {
            return null; // Not authenticated
        }
        throw new Error('Failed to get user info');
    }

    return response.json();
};
