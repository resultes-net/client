import { browser } from "$app/environment";
import { readonly, writable } from "svelte/store";

const _KEY = 'token';

const _writable = writable(getIsAuthenticated());

export const isAuthenticated = readonly(_writable);

export function getIsAuthenticated(): boolean {
    if (!browser) {
        return false;
    }

    return _getTokenOrNull() !== null;
}

function _getTokenOrNull() {
    return localStorage.getItem(_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(_KEY, token);
    _writable.set(true);
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
    _writable.set(false)
}
