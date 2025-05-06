import type { LayoutLoad } from './$types';

import { loadTranslations } from '$lib/i18n/translations';

    
import { redirect } from '@sveltejs/kit';

import * as auth from '../auth'


export const load: LayoutLoad = async ({ url }) => {
    const { pathname } = url;

    const initLocale = 'de-CH'; // get from cookie, user session, ...

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    const isTryingToLogIn = pathname === '/login' || pathname === '/register';
    const isLoggedIn = auth.isAuthenticated();

    if (isLoggedIn && !isTryingToLogIn) {
        return;
    }

    if (isLoggedIn && isTryingToLogIn) {
        redirect(302, "/");
    }

    if (!isLoggedIn && !isTryingToLogIn) {
        redirect(302, "/login");
    }

    if (!isLoggedIn && isTryingToLogIn) {
        return;
    }

    return {};
};