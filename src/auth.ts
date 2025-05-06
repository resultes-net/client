var _token: string | null = null;

export function isAuthenticated(): boolean {
    return _token !== null; 
}

export function setToken(token: string): void {
    _token = token;
}

export function getToken(): string {
    if (!isAuthenticated()) {
        throw new Error("Not authenticated.")
    }

    return _token as string;
}

export function unsetToken(): void {
    _token = null;
}
