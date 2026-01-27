
import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

import * as auth from 'src/auth';

import type { PageLoad } from './$types';

import { getJson } from 'src/ajax';

import { createDisplayResults, loadMoreResults } from './results';

export const load: PageLoad = async ({ params, fetch }) => {
    const bearerToken = auth.getAccessToken();

    const simulation: Simulation = await getJson(
        {
            endPoint: `/simulations/${params.simulationId}`,
            httpVerb: 'GET',
            bearerToken: bearerToken,
            fetchFunction: fetch
        }
    )

    const parameters = simulation.parameters;

    let displayResults = null;
    if (simulation.state === 'done') {
        const displayResults = createDisplayResults();
        await loadMoreResults({ displayResults, variationId: params.variationId, nResultsToLoad: 3 });
    }

    return { parameters, displayResults }
}