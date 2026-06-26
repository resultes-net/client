import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

import * as auth from 'src/auth';

import type { PageLoad } from './$types';

import { getJson } from 'src/ajax';

export const load: PageLoad = async ({ params, fetch, depends }) => {
    depends(`resultes:simulation:${params.simulationId}`);

    const bearerToken = auth.getAccessToken();

    const simulation: Simulation = await getJson(
        {
            endPoint: `/simulations/${params.simulationId}`,
            httpVerb: 'GET',
            bearerToken: bearerToken,
            fetchFunction: fetch
        }
    )

    return { simulation }
}