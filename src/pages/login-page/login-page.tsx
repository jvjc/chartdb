import React from 'react';
import { useAuth } from '@/context/auth-context/auth-context';
import { Helmet } from 'react-helmet-async';

export const LoginPage: React.FC = () => {
    const { loginWithGoogle } = useAuth();
    return (
        <section className="flex h-screen items-center justify-center">
            <Helmet>
                <title>Login - ChartDB</title>
            </Helmet>
            <button
                onClick={() => void loginWithGoogle()}
                className="rounded bg-blue-600 px-4 py-2 text-white"
            >
                Login with Google
            </button>
        </section>
    );
};
