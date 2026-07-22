import { tryGetJson } from 'src/authAjax';
import type { GetSimulation } from 'src/lib/openapi/generated/model/getSimulation.js';

export const load = async ({ params, fetch, depends }) => {
    const simulationId = params.simulationId;
    depends(`resultes:simulation:${simulationId}`);

    const simulation = await tryGetJson<GetSimulation>(
        {
            endPoint: `/simulations/${simulationId}`,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { simulation };
}
