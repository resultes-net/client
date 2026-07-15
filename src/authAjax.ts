import { redirect } from "@sveltejs/kit";
import { getJson, UnauthorizedError } from "./ajax";
import * as auth from './auth';

export async function tryGetJson<O>(
    args: {
        endPoint: string,
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        contentType?: string,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<O> {
    const token = auth.getTokenOrNull();

    if (token === null) {
        redirect(307, '/login');
    }

    const argsWithToken = { ...args, bearerToken: token.token };

    try {
        return await getJson<O>(argsWithToken);
    } catch (exception) {
        if (exception instanceof UnauthorizedError) {
            redirect(307, '/login');
        }
        throw exception;
    }
}