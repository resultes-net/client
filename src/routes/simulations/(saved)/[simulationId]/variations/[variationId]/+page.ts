import { FetchError, getJson } from 'src/ajax';
import type { PageLoad } from './$types';

import { getAccessToken } from 'src/auth';
import { createDisplayResults, loadMoreResults } from './results';

export interface Outputs {
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreEff: number,
    pitStoreQAccum_kW_Tot: number,
}


export const load: PageLoad = async ({ params, parent, url, fetch }) => {
    const data = await parent();

    const simulation = data.simulation;
    const parameters = simulation.parameters;

    const variationId = params.variationId;
    const kpis = await getKPIs(variationId, fetch);

    let displayResults = null;
    if (simulation.state === 'done') {
        displayResults = createDisplayResults();
        await loadMoreResults({ displayResults, variationId: params.variationId, nResultsToLoad: 3 });
    }

    const shallDownload = url.searchParams.get("download") === '';

    return { parameters, kpis, displayResults, shallDownload }
}

async function getKPIs(variationId: string, fetchFunction: (...args: any[]) => Promise<Response>): Promise<Outputs | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;
    const bearerToken = getAccessToken();

    try {
        const outputsArray = await getJson<Outputs[]>({ endPoint, httpVerb: 'GET', bearerToken, fetchFunction });
        const outputs = outputsArray[0];
        return outputs;
    } catch (exception) {
        if (exception instanceof FetchError) {
            return null;
        }
        throw exception;
    }
}
