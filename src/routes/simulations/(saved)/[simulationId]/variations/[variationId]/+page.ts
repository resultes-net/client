import type { PageLoad } from './$types';

import { createDisplayResults, loadMoreResults } from './results';


export const load: PageLoad = async ({ params, parent }) => {
    const data = await parent();

    const simulation = data.simulation;
    const parameters = simulation.parameters;

    let displayResults = null;
    if (simulation.state === 'done') {
        const displayResults = createDisplayResults();
        await loadMoreResults({ displayResults, variationId: params.variationId, nResultsToLoad: 3 });
    }

    return { parameters, displayResults }
}