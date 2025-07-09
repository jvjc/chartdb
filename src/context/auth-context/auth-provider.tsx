import React, { useCallback, useEffect, useState } from 'react';
import type { AuthContext } from './auth-context';
import { authContext } from './auth-context';
import { handleAuthCallback, loginWithGoogle, getAuthToken, logout } from '@/lib/auth';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [token, setToken] = useState<string | null>(getAuthToken()?.accessToken ?? null);

    useEffect(() => {
        handleAuthCallback().then(() => {
            setToken(getAuthToken()?.accessToken ?? null);
        });
    }, []);

    const loginHandler: AuthContext['loginWithGoogle'] = useCallback(async () => {
        await loginWithGoogle();
    }, []);

    const logoutHandler = useCallback(() => {
        logout();
        setToken(null);
    }, []);

    return (
        <authContext.Provider value={{ token, loginWithGoogle: loginHandler, logout: logoutHandler }}>
            {children}
        </authContext.Provider>
    );
};
