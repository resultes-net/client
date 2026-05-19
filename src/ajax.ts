import { PUBLIC_API_BASE_URI } from '$env/static/public';

export class FetchError extends Error {
    constructor(...params: any[]) {
        super(...params);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }

        this.name = "FetchError";
    }
}

export class UnauthorizedError extends FetchError {
    constructor(...params: any[]) {
        super(...params);

        this.name = "UnauthorizedError";
    }
}


export async function getJson<O>(
    {
        endPoint,
        body = null,
        httpVerb = 'POST',
        bearerToken = null,
        contentType = 'application/json',
        baseUri = PUBLIC_API_BASE_URI,
        fetchFunction = fetch
    }: {
        endPoint: string,
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        bearerToken?: string | null,
        contentType?: string,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<O> {
    const accept = "application/json"

    const response = await getResponse({ endPoint, body, httpVerb, bearerToken, contentType, accept, baseUri, fetchFunction });

    const json = await response.json();

    if (response.status !== 200) {
        const error = JSON.stringify(json);

        if (response.status == 401) {
            console.error(`Unauthorized error calling API: {error}`);

            throw new UnauthorizedError(error)
        }

        console.error(`Error calling API: ${error}`);
        throw new FetchError(error);

    }

    return json as O;
}

export async function getBlob(
    {
        endPoint,
        body = null,
        httpVerb = 'GET',
        bearerToken = null,
        contentType = null,
        accept = null,
        baseUri = PUBLIC_API_BASE_URI,
        fetchFunction = fetch
    }: {
        endPoint: string,
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT' | 'HEAD',
        bearerToken?: string | null,
        contentType?: string | null,
        accept?: string | null,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<Blob> {
    const response = await getResponse({ endPoint, body, httpVerb, bearerToken, contentType, accept, baseUri, fetchFunction });

    if (response.status !== 200) {
        const errorMessage = `Error calling API endpoint ${endPoint}`
        console.error(errorMessage);
        throw new FetchError(errorMessage);
    }

    const blob = await response.blob();

    return blob;
}

export async function getResponse({
    endPoint,
    body = null,
    httpVerb = 'GET',
    bearerToken = null,
    contentType = null,
    accept = null,
    baseUri = PUBLIC_API_BASE_URI,
    fetchFunction = fetch
}: {
    endPoint: string,
    body?: BodyInit | null,
    httpVerb?: 'GET' | 'POST' | 'PUT' | 'HEAD',
    bearerToken?: string | null,
    contentType?: string | null,
    accept?: string | null,
    baseUri?: string,
    fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<Response> {
    var headers: Record<string, string> = {
        Accept: accept,
    };

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const requestInit: RequestInit = {
        method: httpVerb,
        headers,
        body
    };

    const uri = `${baseUri}${endPoint}`;

    const request = new Request(uri, requestInit);

    console.debug('About to send request %O.', request)

    return fetchFunction(request);
}
