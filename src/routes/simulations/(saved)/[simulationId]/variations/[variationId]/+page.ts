
import type { ParametersOutput } from '$lib/openapi/generated/model/parametersOutput';
import { type Type } from '$lib/openapi/generated/model/type';
import { UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import { redirectToLoginWithRedirect } from 'src/redirect';
import { loadMoreResults } from './displayResults';
import { createBtesDisplayResults } from './displayResults/createBtesDisplayResults';
import { createPtesDisplayResults } from './displayResults/createPtesDisplayResults';
import { createTtesDisplayResults } from './displayResults/createTtesDisplayResults';
import type { CreateDisplayResults } from './displayResults/displayResults';
import { createBtesKpis } from './tabbedKpisTables/createBtesKpis';
import type { CreateKpis } from './tabbedKpisTables/createKpis';
import { createPtesKpis } from './tabbedKpisTables/createPtesKpis';
import { createTtesKpis } from './tabbedKpisTables/createTtesKpis';

export const load = async ({ parent, url, fetch }) => {
    const { simulation, variation } = await parent();

    const redirectTo = `${url.pathname}${url.search}`

    const parameters = await tryGetJson<ParametersOutput>({ endPoint: `/simulations/${simulation.id}/parameters`, redirectTo, httpVerb: 'GET', fetchFunction: fetch });

    const { createDisplayResults, createKpis } = getFactoryFunctions(simulation.type);

    let kpis = null;
    let displayResults = null;
    if (variation.state === 'done') {
        displayResults = createDisplayResults();

        try {
            [kpis,] = await Promise.all([
                createKpis(variation.id, redirectTo, fetch),
                loadMoreResults({ displayResults, variationId: variation.id, nResultsToLoad: 3 })
            ]);
        } catch (exception) {
            if (exception instanceof UnauthorizedError) {
                redirectToLoginWithRedirect(redirectTo);
            }

            throw exception;
        }
    }

    const shallDownload = url.searchParams.get("download") === '';

    return { systemType: simulation.type, parameters, variation, kpis, displayResults, shallDownload }
}

function getFactoryFunctions(systemType: Type): {
    createDisplayResults: CreateDisplayResults,
    createKpis: CreateKpis
} {
    switch (systemType) {
        case 'ttes': return { createDisplayResults: createTtesDisplayResults, createKpis: createTtesKpis };
        case 'ptes': return { createDisplayResults: createPtesDisplayResults, createKpis: createPtesKpis };
        case 'btes': return { createDisplayResults: createBtesDisplayResults, createKpis: createBtesKpis };
        default: throw new Error(`Unknown system type: ${systemType}.`);
    }
}