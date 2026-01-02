

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
        await checkLoggedInAndGotoIfNeeded(pathname);
    }

    return {};
};

async function checkLoggedInAndGotoIfNeeded(pathname: string): Promise<void> {
    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.getIsAuthenticated();

    if (isLoggedIn && isTryingToLogIn) {
        await goto("/");
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        await goto("/login");
    }
}
