import { defaultLocale, loadTranslations, locales, translations } from '$lib/i18n/translations.js';

export const load = async ({ url, cookies, request }) => {
    const { pathname } = url;

    const acceptLanguageHeader = request.headers.get('accept-language') || '';

    let locale = (cookies.get('lang') || '').toLowerCase();

    if (!locale) {
        let match = acceptLanguageHeader.match(/^[a-z]+(?=[-_])/i);
        if (!match) {
            match = acceptLanguageHeader.match(/^[a-z]+/i);
        }

        locale = match ? match[0].toLowerCase() : defaultLocale;
    }


    const supportedLocales = locales.get().map((l) => l.toLowerCase());

    if (!supportedLocales.includes(locale)) {
        locale = defaultLocale;
    }

    await loadTranslations(locale, pathname);

    return {
        i18n: { locale, route: pathname },
        translations: translations.get(),
    };
};