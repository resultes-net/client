import type { PageLoad } from './$types';

import { redirect } from '@sveltejs/kit';

import * as auth from '../auth'

export var load: PageLoad = ({ route }) => {
    const isTryingToLogIn = route.id === '/login' || route.id === '/register';
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
}

