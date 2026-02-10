import { getBlob } from 'src/ajax';
import * as auth from 'src/auth';

export async function downloadResultToObjectUrl({ resultPath, variationId, httpVerb = 'GET', accept = null, fetchFunction = fetch }: {
    resultPath: string, variationId: string, accept?: string | null, httpVerb?: 'GET' | 'POST' | 'PUT' | 'HEAD', fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<string> {
    const variationEndPoint = `/variations/${variationId}`

    const endPoint = `${variationEndPoint}/results/${resultPath}`;
    const bearerToken = auth.getAccessToken();

    const blob = await getBlob({
        endPoint,
        httpVerb,
        bearerToken,
        accept,
        fetchFunction
    });

    const objectUrl = URL.createObjectURL(blob)

    return objectUrl;
}