import { assert } from 'src/lib/utils';
import type { PageLoad } from './$types';

import { downloadResults } from './results';


export const load: PageLoad = async ({ params, parent, url, fetch, depends }) => {
    const data = await parent();

    const simulation = data.simulation;
    const parameters = simulation.parameters;

    const variationId = params.variationId;

    const variationResults = await downloadResults({
        variationId,
        displayResults: null,
        nDisplayResultsToDownload: 3,
        lastUpdatedOn: null,
        fetchFunction: fetch
    });

    assert(variationResults !== "unchanged" && variationResults !== "display-results-loaded");

    const shallDownload = url.searchParams.get("download") === '';

    return { parameters, variationResults, shallDownload }
}
