import { getBlob } from 'src/ajax';
import * as auth from 'src/auth';

export async function downloadResultToObjectUrl({ resultPath, variationId, httpVerb = 'GET', fetchFunction = fetch }: {
    resultPath: string, variationId: string, httpVerb?: 'GET' | 'POST' | 'PUT' | 'HEAD', fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<string> {
    const variationEndPoint = `/variations/${variationId}`

    const endPoint = `${variationEndPoint}/results/${resultPath}`;
    const bearerToken = auth.getAccessToken();

    const blob = await getBlob({
        endPoint,
        httpVerb,
        accept: 'image/png',
        bearerToken,
        fetchFunction
    });

    const objectUrl = URL.createObjectURL(blob)

    return objectUrl;
}