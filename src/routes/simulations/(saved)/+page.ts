import { tryGetJson } from 'src/authAjax';
import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

export const load = async ({ fetch }) => {
    const simulations = await tryGetJson<Simulation[]>({ endPoint: '/simulations', httpVerb: 'GET', fetchFunction: fetch });

    return { simulations }
};