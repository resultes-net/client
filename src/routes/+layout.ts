

import type { LayoutLoad } from './$types';

import { addTranslations, setLocale, setRoute } from '$lib/i18n/translations.js';


import { browser } from '$app/environment';
import { goto } from '$app/navigation';


import * as auth from '../auth';


export const load: LayoutLoad = async ({ data }) => {
    const { i18n: { locale, route: pathname }, translations } = data;

    addTranslations(translations);

    await setRoute(pathname);
    await setLocale(locale);

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
