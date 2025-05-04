import { writable, get } from "svelte/store";

var _token: string | null = null;

export function isAuthenticated(): boolean {
    return _token !== null; 
}

export function setToken(token: string): void {
    _token = token;
}

export function unsetToken(): void {
    _token = null;
}
