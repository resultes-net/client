import { browser } from "$app/environment";
import { readonly, writable } from "svelte/store";

import type { Token } from "./lib/openapi/generated/model/token";

interface LocalToken extends Token {
    userName: string,
}

export interface UserToken {
    userName: string,
    token: string,
}

const _KEY = 'token';

const _writable = writable(getTokenOrNull() !== null);

export const isAuthenticated = readonly(_writable);

function isInFuture(isoDate: string): boolean {
    const time = Date.parse(isoDate);

    if (Number.isNaN(time)) {
        throw new Error("Date couldn't be parsed.");
    }

    const date = new Date(time);

    const now = new Date();

    const isInFuture = date > now;

    return isInFuture;
}

function getLocalTokenOrNull(): LocalToken | null {
    const jsonOrNull = localStorage.getItem(_KEY);
    if (jsonOrNull === null) {
        return null;
    }

    const token: LocalToken = JSON.parse(jsonOrNull)
    return token
}

export function setToken(userName: string, token: Token): void {
    const localToken: LocalToken = { userName: userName, ...token };
    const json = JSON.stringify(localToken);
    localStorage.setItem(_KEY, json);
    _writable.set(true);
}

export function getTokenOrNull(): UserToken | null {
    if (!browser) {
        return null;
    }

    const localToken = getLocalTokenOrNull();

    if (localToken === null) {
        return null;
    }

    const isValid = isInFuture(localToken.valid_until);

    if (!isValid) {
        unsetToken();
        return null;
    }

    const userToken: UserToken = { userName: localToken.userName, token: localToken.access_token };

    return userToken;
}

export function unsetToken(): void {
    localStorage.removeItem(_KEY);
    _writable.set(false)
}
