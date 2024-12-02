import { type Load } from '@sveltejs/kit';

import { loadTranslations } from '$lib/i18n/translations';

export const load: Load = async ({ url }) => {
    const { pathname } = url;

    const initLocale = 'de-CH'; // get from cookie, user session, ...

    await loadTranslations(initLocale, pathname); // keep this just before the `return`

    return {};
};