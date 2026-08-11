import type { DisplayResult } from '$lib/outputs/displayResults';
import { getBlob, UnauthorizedError } from 'src/ajax';
import * as auth from 'src/auth';

export async function loadMoreResults({
    displayResults, variationId, nResultsToLoad
}: {
    displayResults: DisplayResult[], variationId: string, nResultsToLoad: number | null
}) {
    const firstIndexToLoad = displayResults.findIndex((r) => !r.data);

    nResultsToLoad = nResultsToLoad === null ? displayResults.length : nResultsToLoad;

    if (nResultsToLoad < 0) {
        throw new Error("Number of results to load must be >= 0 or null.")
    }

    const displayResultsToLoad = displayResults.slice(firstIndexToLoad, firstIndexToLoad + nResultsToLoad);

    const promises = displayResultsToLoad.map(async (r) => {
        const blob = await downloadResultBlob({
            resultPath: r.path,
            variationId,
            accept: 'image/png'
        });

        r.data = { blob, url: null };
    });

    await Promise.all(promises);
}


async function downloadResultBlob({ resultPath, variationId, accept, fetchFunction = fetch }: {
    resultPath: string, variationId: string, accept: string, fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<Blob> {
    const token = auth.getTokenOrNull();
    if (token === null) {
        throw new UnauthorizedError();
    }

    const variationEndPoint = `/variations/${variationId}`
    const endPoint = `${variationEndPoint}/results/${resultPath}`;

    const blob = await getBlob({
        endPoint,
        bearerToken: token.token,
        accept,
        fetchFunction
    });

    return blob;
}
