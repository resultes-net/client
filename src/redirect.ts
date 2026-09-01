import { redirect } from "@sveltejs/kit";

export function redirectToLoginWithRedirect(currentEndpoint: string): never {
    const encoded = encodeURIComponent(currentEndpoint);
    const url = `/login?redirect=${encoded}`
    redirect(307, url);
}