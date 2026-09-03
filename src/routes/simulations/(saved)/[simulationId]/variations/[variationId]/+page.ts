
import type { ParametersOutput } from '$lib/openapi/generated/model/parametersOutput';
import { tryGetJson } from 'src/authAjax';
import { loadMoreResults } from './displayResults';
import { createBtesDisplayResults } from './displayResults/createBtesDisplayResults';
import { createPtesDisplayResults } from './displayResults/createPtesDisplayResults';
import { createTtesDisplayResults } from './displayResults/createTtesDisplayResults';
import type { DisplayResult } from './displayResults/displayResults';
import { createBtesKpis } from './tabbedKpisTables/createBtesKpis';
import { createPtesKpis } from './tabbedKpisTables/createPtesKpis';
import { createTtesKpis } from './tabbedKpisTables/createTtesKpis';

export const load = async ({ parent, params, url, fetch }) => {
    const { variation } = await parent();

    const redirectTo = `${url.pathname}${url.search}`
    const parameters = await tryGetJson<ParametersOutput>({ endPoint: `/simulations/${params.simulationId}/parameters`, redirectTo, httpVerb: 'GET', fetchFunction: fetch });

    const systemType = parameters.values.type;

    const shallDownload = url.searchParams.get("download") === '';

    if (variation.state !== 'done') {
        return { systemType, parameters, variation, kpis: null, displayResults: null, shallDownload }
    }

    const { displayResults, kpis: kpisPromise } = getDisplayResultsAndKpis(variation.id, parameters, redirectTo, fetch);

    const [kpis,] = await Promise.all([
        kpisPromise,
        loadMoreResults({ displayResults, variationId: variation.id, nResultsToLoad: 3 })
    ]);



    return { systemType: parameters.values.type, parameters, variation, kpis, displayResults, shallDownload }
}

function getDisplayResultsAndKpis(variationId: string, parameters: ParametersOutput, redirectTo: string, fetchFunction: FetchFunction): {
    displayResults: DisplayResult[],
    kpis: Promise<Kpis | null>
} {
    const systemType = parameters.values.type;

    if (systemType === 'ttes') {
        const displayResults = createTtesDisplayResults();
        const kpis = createTtesKpis(variationId, parameters.values, redirectTo, fetchFunction);

        return { displayResults, kpis };
    }

    if (systemType === 'ptes') {
        const displayResults = createPtesDisplayResults();
        const kpis = createPtesKpis(variationId, parameters.values, redirectTo, fetchFunction);

        return { displayResults, kpis };
    }

    if (systemType === 'btes') {
        const displayResults = createBtesDisplayResults();
        const kpis = createBtesKpis(variationId, parameters.values, redirectTo, fetchFunction);

        return { displayResults, kpis };
    }

    throw new Error(`Unknown system type: ${systemType}.`);
}