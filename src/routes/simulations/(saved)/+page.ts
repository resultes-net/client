import { tryGetJson } from 'src/authAjax';
import type { GetSimulation } from 'src/lib/openapi/generated/model/getSimulation.js';

export const load = async ({ fetch }) => {
    const simulations = await tryGetJson<GetSimulation[]>({ endPoint: '/simulations', httpVerb: 'GET', fetchFunction: fetch });

    return { simulations }
};