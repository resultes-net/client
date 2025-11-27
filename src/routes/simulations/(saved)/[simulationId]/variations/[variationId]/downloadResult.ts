import { getBlob } from 'src/ajax';
import * as auth from 'src/auth';

export async function downloadResultToObjectUrl({ resultPath, variationId, fetchFunction = fetch }: {
    resultPath: string, variationId: string, fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<string> {
    const variationEndPoint = `/variations/${variationId}`

    const endPoint = `${variationEndPoint}/results/${resultPath}`;
    const bearerToken = auth.getAccessToken();

    const blob = await getBlob({
        endPoint,
        httpVerb: 'GET',
        accept: 'image/png',
        bearerToken,
        fetchFunction
    });

    const objectUrl = URL.createObjectURL(blob)

    return objectUrl;
}