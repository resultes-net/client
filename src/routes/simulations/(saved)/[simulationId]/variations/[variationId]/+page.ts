
import { type Type } from '$lib/openapi/generated/model/type';
import * as btes from '$lib/outputs/btes';
import * as ptes from '$lib/outputs/ptes';
import * as ttes from '$lib/outputs/ttes';
import { redirect } from '@sveltejs/kit';
import { UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import type { ParametersOutput } from 'src/lib/openapi/generated/model/parametersOutput';
import type { CreateDisplayResults } from 'src/lib/outputs/displayResults';
import type { CreateKpis } from 'src/lib/outputs/kpis';
import { loadMoreResults } from './displayResults';

export const load = async ({ parent, url, fetch }) => {
    const { simulation, variation } = await parent();

    const parameters = await tryGetJson<ParametersOutput>({ endPoint: `/simulations/${simulation.id}/parameters`, httpVerb: 'GET', fetchFunction: fetch });

    const { createDisplayResults, createKpis } = getFactoryFunctions(simulation.type);

    let kpis = null;
    let displayResults = null;
    if (variation.state === 'done') {
        displayResults = createDisplayResults();

        try {
            [kpis,] = await Promise.all([
                createKpis(variation.id, fetch),
                loadMoreResults({ displayResults, variationId: variation.id, nResultsToLoad: 3 })
            ]);
        } catch (exception) {
            if (exception instanceof UnauthorizedError) {
                redirect(307, '/login');
            }

            throw exception;
        }
    }

    const shallDownload = url.searchParams.get("download") === '';

    return { parameters, variation, kpis, displayResults, shallDownload }
}

function getFactoryFunctions(systemType: Type): {
    createDisplayResults: CreateDisplayResults,
    createKpis: CreateKpis
} {
    switch (systemType) {
        case 'ttes': return ttes;
        case 'ptes': return ptes
        case 'btes': return btes;
        default: throw new Error(`Unknown system type: ${systemType}.`);
    }
}