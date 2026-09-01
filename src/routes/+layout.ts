

import type { LayoutLoad } from './$types';

import { addTranslations, setLocale, setRoute } from '$lib/i18n/translations.js';

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import * as auth from '../auth';


export const load: LayoutLoad = async ({ data, url: { pathname, search } }) => {
    const { i18n: { locale, route: localeRoute }, translations } = data;

    addTranslations(translations);

    await setRoute(localeRoute);
    await setLocale(locale);

    if (browser) {
        checkLoggedInAndRedirectIfNeeded(pathname, search);
    }
    
    return {};
};

function checkLoggedInAndRedirectIfNeeded(pathname: string, search: string) {
    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.getTokenOrNull() !== null;

    if (isLoggedIn && isTryingToLogIn) {
        redirect(307, "/");
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        const url = encodeURIComponent(`${pathname}${search}`);
        redirect(307, `/login?redirect=${url}`);
    }
}
