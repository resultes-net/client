import { PUBLIC_API_BASE_URI } from '$env/static/public';

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
        console.error(`Error calling API: ${error}`);
        throw new Error(error);
    }

    return json as O;
}

export async function getBlob(
    {
        endPoint,
        body = null,
        httpVerb = 'POST',
        bearerToken = null,
        contentType = null,
        accept,
        baseUri = PUBLIC_API_BASE_URI,
        fetchFunction = fetch
    }: {
        endPoint: string,
        body?: BodyInit | null,
        httpVerb?: 'GET' | 'POST' | 'PUT',
        bearerToken?: string | null,
        contentType?: string | null,
        accept: string,
        baseUri?: string,
        fetchFunction?: (...args: any[]) => Promise<Response>
    }
): Promise<Blob> {
    const response = await getResponse({ endPoint, body, httpVerb, bearerToken, contentType, accept, baseUri, fetchFunction });

    if (response.status !== 200) {
        const errorMessage = `Error calling API endpoint ${endPoint}`
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const blob = await response.blob();

    return blob;
}

async function getResponse({
    endPoint,
    body,
    httpVerb,
    bearerToken,
    contentType,
    accept,
    baseUri,
    fetchFunction
}: {
    endPoint: string,
    body: BodyInit | null,
    httpVerb: 'GET' | 'POST' | 'PUT',
    bearerToken: string | null,
    contentType: string | null,
    accept: string,
    baseUri: string,
    fetchFunction: (...args: any[]) => Promise<Response>
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

    console.debug(`About to ${httpVerb} ${requestInit.body}`);

    const uri = `${baseUri}${endPoint}`;

    const request = new Request(uri, requestInit);

    return fetchFunction(request);
}
