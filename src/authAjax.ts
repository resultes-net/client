import { redirect } from "@sveltejs/kit";
import { getJson, UnauthorizedError } from "./ajax";

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
): Promise<O> {
    try {
        return await getJson<O>(args);
    } catch (exception) {
        if (exception instanceof UnauthorizedError) {
            redirect(307, '/login');
        }
        throw exception;
    }
}