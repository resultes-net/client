import { getJson, UnauthorizedError } from "./ajax";
import * as auth from './auth';
import { redirectToLoginWithRedirect } from "./redirect";

export async function tryGetJson<O>(
    args: {
        endPoint: string,
        redirectTo: string
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        contentType?: string,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<O> {
    const { redirectTo, ...otherArgs } = args;

    const token = auth.getTokenOrNull();

    if (token === null) {
        redirectToLoginWithRedirect(redirectTo);
    }

    const otherArgsWithToken = { ...otherArgs, bearerToken: token.token };

    try {
        return await getJson<O>(otherArgsWithToken);
    } catch (exception) {
        if (exception instanceof UnauthorizedError) {
            redirectToLoginWithRedirect(redirectTo);
        }
        throw exception;
    }
}