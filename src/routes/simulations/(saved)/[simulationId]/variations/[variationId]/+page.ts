import type { PageLoad } from './$types';

import { getAccessToken } from 'src/auth';
import { tryGetJson } from 'src/authAjax';
import { type Variation } from 'src/lib/openapi/generated/model/variation';
import { assert } from 'src/lib/utils';
import { createDisplayResults, loadMoreResults } from './displayResults';

export interface Outputs {
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreEff: number,
    pitStoreQAccum_kW_Tot: number,
}


export const load: PageLoad = async ({ params, parent, url, fetch, depends }) => {
    const data = await parent();

    const simulation = data.simulation;
    const parameters = simulation.parameters;

    const variationId = params.variationId;
    depends(`resultes:variation:${variationId}`);

    const endPoint = `/variations/${variationId}`;
    const bearerToken = getAccessToken();
    const variation = await tryGetJson<Variation>({ endPoint, httpVerb: 'GET', bearerToken, fetchFunction: fetch });

    assert(variation !== null, 'Variation cannot be null here.');

    let kpis = null;
    let displayResults = null;
    if (variation.state === 'done') {
        kpis = await getKPIs(variationId, fetch);
        displayResults = createDisplayResults();

        [kpis,] = await Promise.all([
            getKPIs(variationId, fetch),
            loadMoreResults({ displayResults, variationId, nResultsToLoad: 3 })
        ]);
    }

    const shallDownload = url.searchParams.get("download") === '';

    return { parameters, variation, kpis, displayResults, shallDownload }
}

async function getKPIs(variationId: string, fetchFunction: (...args: any[]) => Promise<Response>): Promise<Outputs | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;
    const bearerToken = getAccessToken();

    const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', bearerToken, fetchFunction });

    if (outputsArray === null) {
        return null;
    }

    return outputsArray[0];
}
