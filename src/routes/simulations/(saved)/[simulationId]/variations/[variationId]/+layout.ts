import type { LayoutLoad } from './$types';

import { getJson } from 'src/ajax';
import * as auth from 'src/auth';

import type { Simulation } from 'src/lib/openapi/generated/model/simulation';
import type { Variation } from 'src/lib/openapi/generated/model/variation';

export const load: LayoutLoad = async ({ params, fetch }) => {
    const bearerToken = auth.getAccessToken();

    const simulation: Simulation = await getJson(
        {
            endPoint: `/simulations/${params.simulationId}`,
            httpVerb: 'GET',
            bearerToken,
            fetchFunction: fetch
        }
    )

    const variation: Variation = await getJson({
        endPoint: `/variations/${params.variationId}`,
        httpVerb: 'GET',
        bearerToken,
        fetchFunction: fetch,
    })

    return { simulation, variation }
}