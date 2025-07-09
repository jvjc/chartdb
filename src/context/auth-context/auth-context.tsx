import { createContext, useContext } from 'react';
import { emptyFn } from '@/lib/utils';

export interface AuthContext {
    token: string | null;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
}

export const authContext = createContext<AuthContext>({
    token: null,
    loginWithGoogle: async () => emptyFn(),
    logout: emptyFn,
});

export const useAuth = () => useContext(authContext);
