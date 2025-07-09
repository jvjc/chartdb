import { GOOGLE_CLIENT_ID, SSO_BASE_URL } from './env';

interface AuthToken {
    accessToken: string;
    idToken?: string;
    expiresAt: number;
}

const TOKEN_KEY = 'chartdb_auth_token';
const VERIFIER_KEY = 'pkce_verifier';
const useMock = SSO_BASE_URL === '';

function base64UrlEncode(buffer: ArrayBuffer): string {
    let string = '';
    const bytes = new Uint8Array(buffer);
    for (const byte of bytes) {
        string += String.fromCharCode(byte);
    }
    return btoa(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomString(length = 64): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map((b) => ('0' + (b % 36).toString(36)).slice(-1))
        .join('');
}

export const getAuthToken = (): AuthToken | null => {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as AuthToken;
    } catch {
        return null;
    }
};

export const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const loginWithGoogle = async (): Promise<void> => {
    if (useMock) {
        localStorage.setItem(
            TOKEN_KEY,
            JSON.stringify({ accessToken: 'mock', expiresAt: Date.now() + 3600 * 1000 })
        );
        return;
    }
    const verifier = randomString(64);
    const encoded = new TextEncoder().encode(verifier);
    const hashed = await crypto.subtle.digest('SHA-256', encoded);
    const challenge = base64UrlEncode(hashed);
    sessionStorage.setItem(VERIFIER_KEY, verifier);
    const redirectUri = `${window.location.origin}/auth/callback`;
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        scope: 'openid email profile',
        code_challenge: challenge,
        code_challenge_method: 'S256',
    });
    window.location.href = `${SSO_BASE_URL}/authorize?${params.toString()}`;
};

export const handleAuthCallback = async (): Promise<void> => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (!code) {
        return;
    }
    if (useMock) {
        localStorage.setItem(
            TOKEN_KEY,
            JSON.stringify({ accessToken: 'mock', expiresAt: Date.now() + 3600 * 1000 })
        );
        return;
    }
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    if (!verifier) {
        return;
    }
    const redirectUri = `${window.location.origin}/auth/callback`;
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: GOOGLE_CLIENT_ID,
        code,
        code_verifier: verifier,
        redirect_uri: redirectUri,
    });
    const response = await fetch(`${SSO_BASE_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    if (!response.ok) {
        return;
    }
    const data = await response.json();
    localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({
            accessToken: data.access_token,
            idToken: data.id_token,
            expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
        })
    );
};

