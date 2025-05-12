import { PUBLIC_API_BASE_URI } from '$env/static/public'

export async function ajax<O>(
    {
        endPoint,
        body,
        httpVerb = 'POST',
        bearerToken = null,
        contentType = 'application/Json',
        baseUri = PUBLIC_API_BASE_URI,
    }: {
        endPoint: string,
        body: BodyInit | null | undefined,
        httpVerb?: string,
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
        method: httpVerb,
        headers,
        body
    };

    console.debug(`About to ${httpVerb} ${requestInit.body}`);

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