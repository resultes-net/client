
import { createDisplayResults, loadMoreResults } from './results';

export const load = async ({ params }) => {
    const displayResults = createDisplayResults();

    await loadMoreResults({ displayResults, variationId: params.variationId, nResultsToLoad: null });

    return { displayResults }
}