import { goto } from "$app/navigation";
import { FetchError, getJson, UnauthorizedError } from "./ajax";

export async function tryGetJson<O>(
    args: {
        endPoint: string,
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        bearerToken?: string | null,
        contentType?: string,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<O | null> {
    try {
        return await getJson<O>(args);
    } catch (exception) {
        if (exception instanceof FetchError) {
            if (exception instanceof UnauthorizedError) {
                goto('/login');
            }
            return null;
        }
        throw exception;
    }
}