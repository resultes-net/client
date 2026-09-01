import { type GetSimulation } from '$lib/openapi/generated/model/getSimulation.js';
import { tryGetJson } from 'src/authAjax';

export const load = async ({ fetch, url: { pathname, search } }) => {
    const redirectTo = `${pathname}${search}`

    const simulations = await tryGetJson<GetSimulation[]>({ endPoint: '/simulations', redirectTo, httpVerb: 'GET', fetchFunction: fetch });

    return { simulations }
};