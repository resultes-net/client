
import { redirect } from '@sveltejs/kit';
import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import { createDisplayResults, loadMoreResults } from './displayResults';

export interface Outputs {
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreEff: number,
    pitStoreQAccum_kW_Tot: number,
}


export const load = async ({ parent, url, fetch }) => {
    const { simulation, variation } = await parent();

    let kpis = null;
    let displayResults = null;
    if (variation.state === 'done') {
        displayResults = createDisplayResults();

        try {
            [kpis,] = await Promise.all([
                getKPIs(variation.id, fetch),
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

    const parameters = simulation.parameters;

    return { parameters, variation, kpis, displayResults, shallDownload }
}

async function getKPIs(variationId: string, fetchFunction: (...args: any[]) => Promise<Response>): Promise<Outputs | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', fetchFunction });
        return outputsArray[0];
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
