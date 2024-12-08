import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
    loaders: [
        {
            locale: 'en',
            key: 'common',
            loader: async () => (
                await import('./en/common.json')
            ).default,
        },
        {
            locale: 'de-CH',
            key: 'common',
            loader: async () => (
                await import('./de-CH/common.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'ttes',
            loader: async () => (
                await import('./en/ttes.json')
            ).default,
        },
        {
            locale: 'de-CH',
            key: 'ttes',
            loader: async () => (
                await import('./de-CH/ttes.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'ptes',
            loader: async () => (
                await import('./en/ptes.json')
            ).default,
        },
        {
            locale: 'de-CH',
            key: 'ptes',
            loader: async () => (
                await import('./de-CH/ptes.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'btes',
            loader: async () => (
                await import('./en/btes.json')
            ).default,
        },
        {
            locale: 'de-CH',
            key: 'btes',
            loader: async () => (
                await import('./de-CH/btes.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'units',
            loader: async () => (
                await import('./en/units.json')
            ).default,
        },
        {
            locale: 'de-CH',
            key: 'units',
            loader: async () => (
                await import('./de-CH/units.json')
            ).default,
        }
    ]
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);