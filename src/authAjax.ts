import { type FetchFunction, getJson, UnauthorizedError } from "./ajax";
import * as auth from './auth';
import { redirectToLoginWithRedirect } from "./redirect";

export { UnauthorizedError, type FetchFunction };

export async function tryGetJson<O>(
    args: {
        endPoint: string,
        redirectTo?: string
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        contentType?: string,
        baseUri?: string,
        fetchFunction?: FetchFunction
    }
): Promise<O> {
    const { redirectTo = null, ...otherArgs } = args;

    const token = auth.getTokenOrNull();

    if (token === null) {
        if (redirectTo !== null) {
            redirectToLoginWithRedirect(redirectTo);
        } else {
            throw new UnauthorizedError();
        }
    }

    const otherArgsWithToken = { ...otherArgs, bearerToken: token.token };

    try {
        return await getJson<O>(otherArgsWithToken);
    } catch (exception) {
        if (exception instanceof UnauthorizedError && redirectTo !== null) {
            redirectToLoginWithRedirect(redirectTo);
        }
        throw exception;
    }
}