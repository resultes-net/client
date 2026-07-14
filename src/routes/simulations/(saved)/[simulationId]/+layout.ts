import * as auth from 'src/auth';
import { tryGetJson } from 'src/authAjax';

import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

export const load = async ({ params, fetch, depends }) => {
    const bearerToken = auth.getAccessToken();

    const simulationId = params.simulationId;
    depends(`resultes:simulation:${simulationId}`);

    const simulation = await tryGetJson<Simulation>(
        {
            endPoint: `/simulations/${simulationId}`,
            httpVerb: 'GET',
            bearerToken,
            fetchFunction: fetch
        }
    )

    return { simulation };
}
