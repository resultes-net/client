import type { GetSimulation } from '$lib/openapi/generated/model/getSimulation.js';
import { tryGetJson } from 'src/authAjax';

export const load = async ({ params, url: { pathname, search }, fetch, depends }) => {
    const simulationId = params.simulationId;
    depends(`resultes:simulation:${simulationId}`);

    const redirectTo = `${pathname}${search}`;

    const simulation = await tryGetJson<GetSimulation>(
        {
            endPoint: `/simulations/${simulationId}`,
            redirectTo,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { simulation };
}
