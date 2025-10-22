import type { PageLoad } from './$types';

import { browser } from '$app/environment';

import { getJson } from 'src/ajax';
import * as auth from 'src/auth';
import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

export const load: PageLoad<{ simulations: Simulation[] }> = async ({ fetch }) => {
    if (!browser) {
        return { simulations: [] }
    }

    const bearerToken = auth.getAccessToken();

    const simulations: Simulation[] = await getJson({ endPoint: '/simulations', httpVerb: 'GET', bearerToken, fetchFunction: fetch });

    return { simulations }
};