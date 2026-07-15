import { tryGetJson } from 'src/authAjax';

import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

export const load = async ({ params, fetch, depends }) => {
    const simulationId = params.simulationId;
    depends(`resultes:simulation:${simulationId}`);

    const simulation = await tryGetJson<Simulation>(
        {
            endPoint: `/simulations/${simulationId}`,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { simulation };
}
