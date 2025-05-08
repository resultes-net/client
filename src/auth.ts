const _KEY = 'token';

export function isAuthenticated(): boolean {
    return _getTokenOrNull() !== null;
}

function _getTokenOrNull() {
    return localStorage.getItem(_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(_KEY, token);
}

export function getToken(): string {
    const tokenOrNull = _getTokenOrNull();

    if (tokenOrNull === null) {
        throw new Error("Not authenticated.")
    }

    return tokenOrNull;
}

export function unsetToken(): void {
    localStorage.removeItem(_KEY);
}
