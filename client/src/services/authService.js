export const loginWithToken = async (token) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details?.message || 'Authentication failed. Please check your token.');
    }

    return response.json();
};
