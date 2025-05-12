

import type { LayoutLoad } from './$types';

import { browser } from '$app/environment';
import { goto } from '$app/navigation';

import { loadTranslations } from '$lib/i18n/translations';

import * as auth from '../auth';


export const load: LayoutLoad = async ({ url }) => {
    const { pathname } = url;

    const initLocale = 'de-CH'; // get from cookie, user session, ...

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    if (browser) {
        checkLoggedInAndGotoIfNeeded(pathname);
    }

    return {};
};

function checkLoggedInAndGotoIfNeeded(pathname: string) {
    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.getIsAuthenticated();

    if (isLoggedIn && isTryingToLogIn) {
        goto("/");
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        goto("/login");
    }
}
