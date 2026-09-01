import { goto } from "$app/navigation";


export function gotoLoginWithRedirect(currentUrl: URL) {
    const pathname = currentUrl.pathname;
    const search = currentUrl.search;
    const redirect = encodeURIComponent(`${pathname}${search}`)
    goto(`/login?redirect=${redirect}`)
}