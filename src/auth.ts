import { browser } from "$app/environment";
import { readonly, writable } from "svelte/store";

import type { Token } from "./lib/openapi/generated/model/token";

interface LocalToken extends Token {
    username: string,
}

const _KEY = 'token';

const _writable = writable(getIsAuthenticated());

export const isAuthenticated = readonly(_writable);

export function getIsAuthenticated(): boolean {
    if (!browser) {
        return false;
    }

    const tokenOrNull = getTokenOrNull();

    if (tokenOrNull === null) {
        return false;
    }

    return getIsTokenValid();
}

function getIsTokenValid(): boolean {
    const token = getToken();

    const valid_until = new Date(token.valid_until);

    const now = new Date();

    const isValid = valid_until > now;

    return isValid;
}

function getTokenOrNull(): LocalToken | null {
    const jsonOrNull = localStorage.getItem(_KEY);
    if (jsonOrNull === null) {
        return null;
    }

    const token: LocalToken = JSON.parse(jsonOrNull)
    return token
}

function getToken(): LocalToken {
    const tokenOrNull = getTokenOrNull();

    if (tokenOrNull === null) {
        throw new Error("Not authenticated.")
    }

    return tokenOrNull;
}

export function setToken(username: string, token: Token): void {
    const localToken: LocalToken = { username, ...token };
    const json = JSON.stringify(localToken);
    localStorage.setItem(_KEY, json);
    _writable.set(true);
}

export function getAccessToken(): string {
    const token = getToken();
    return token.access_token;
}

export function getUserName(): string {
    const token = getToken();
    return token.username
}

export function unsetToken(): void {
    localStorage.removeItem(_KEY);
    _writable.set(false)
}
