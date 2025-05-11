import { PUBLIC_API_BASE_URI } from '$env/static/public'

export async function post<O>(
    {
        endPoint,
        body,
        bearerToken = null,
        contentType = 'application/Json',
        baseUri = PUBLIC_API_BASE_URI,
    }: {
        endPoint: string,
        body: BodyInit | null | undefined,
        bearerToken?: string | null,
        contentType?: string,
        baseUri?: string
    }
): Promise<O> {
    var headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': contentType
    }

    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`
    }

    const requestInit: RequestInit = {
        method: 'POST',
        headers,
        body
    };

    console.debug(`About to post ${requestInit.body}`);

    const uri = `${baseUri}${endPoint}`

    const request = new Request(uri, requestInit);

    const response = await fetch(request);

    const json = await response.json();

    if (response.status !== 200) {
        const error = JSON.stringify(json);
        console.error(`Error calling API: ${error}`);
        throw new Error(error);
    }

    return json as O;
}