

import type { LayoutLoad } from './$types';

import { addTranslations, setLocale, setRoute } from '$lib/i18n/translations.js';

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import * as auth from '../auth';


export const load: LayoutLoad = async ({ data, url: { pathname } }) => {
    const { i18n: { locale, route: localeRoute }, translations } = data;

    addTranslations(translations);

    await setRoute(localeRoute);
    await setLocale(locale);

    if (browser) {
        checkLoggedInAndRedirectIfNeeded(pathname);
    }
    
    return {};
};

function checkLoggedInAndRedirectIfNeeded(pathname: string) {
    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.getTokenOrNull() !== null;

    if (isLoggedIn && isTryingToLogIn) {
        redirect(307, "/");
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        redirect(307, "/login");
    }
}
