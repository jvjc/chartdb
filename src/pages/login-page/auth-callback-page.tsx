import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/context/auth-context/auth-context';

export const AuthCallbackPage: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token !== null) {
            navigate('/my-diagrams');
        }
    }, [token, navigate]);

    return (
        <section className="flex h-screen items-center justify-center">
            <Helmet>
                <title>Logging in...</title>
            </Helmet>
            <p>Logging in...</p>
        </section>
    );
};
