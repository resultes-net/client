

import type { LayoutLoad } from './$types';

import { addTranslations, setLocale, setRoute } from '$lib/i18n/translations.js';

import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import * as auth from '../auth';


export const load: LayoutLoad = async ({ data, url }) => {
    const { i18n: { locale, route: localeRoute }, translations } = data;

    addTranslations(translations);

    await setRoute(localeRoute);
    await setLocale(locale);

    if (browser) {
        checkLoggedInAndRedirectIfNeeded(url);
    }

    return {};
};

function checkLoggedInAndRedirectIfNeeded(url: URL) {
    const pathname = url.pathname;

    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.getTokenOrNull() !== null;

    if (isLoggedIn && isTryingToLogIn) {
        const redirectTo = url.searchParams.get('redirect') ?? '/';
        
        redirect(307, redirectTo);
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        const search = url.search;

        const redirectTo = encodeURIComponent(`${pathname}${search}`);

        redirect(307, `/login?redirect=${redirectTo}`);
    }
}
