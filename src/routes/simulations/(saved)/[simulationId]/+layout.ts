import { tryGetJson } from 'src/authAjax';
import type { Simulation } from '$lib/openapi/generated/model/simulation.js';

export const load = async ({ params, url: { pathname, search }, fetch, depends }) => {
    const simulationId = params.simulationId;
    depends(`resultes:simulation:${simulationId}`);

    const redirectTo = `${pathname}${search}`;

    const simulation = await tryGetJson<Simulation>(
        {
            endPoint: `/simulations/${simulationId}`,
            redirectTo,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { simulation };
}
