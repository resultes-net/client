import * as auth from "src/auth";
import { tryGetJson } from "src/authAjax";
import { type Variation } from "src/lib/openapi/generated/model/variation";
import { assert } from "src/lib/utils";
import * as ds from "./displayResults";

export interface KPIS {
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreEff: number,
    pitStoreQAccum_kW_Tot: number,
}

export interface VariationResults {
    variation: Variation,
    results: Results | null,
}

export interface Results {
    kpis: KPIS | null,
    displayResults: ds.DisplayResult[],
}

export async function downloadResults(
    { variationId, displayResults, nDisplayResultsToDownload, lastUpdatedOn, fetchFunction }:
        {
            variationId: string,
            displayResults: ds.DisplayResult[] | null,
            nDisplayResultsToDownload: number | null,
            lastUpdatedOn: Date | null,
            fetchFunction: (...args: any[]) => Promise<Response>
        }
): Promise<VariationResults | "display-results-loaded" | "unchanged"> {
    const endPoint = `/variations/${variationId}`;
    const bearerToken = auth.getAccessToken();
    const variation = await tryGetJson<Variation>({ endPoint, httpVerb: 'GET', bearerToken, fetchFunction });

    assert(variation !== null, 'Variation cannot be null here.');

    const variationStateChangedOn = new Date(Date.parse(variation.state_changed_on));

    if (lastUpdatedOn === null || variationStateChangedOn > lastUpdatedOn) {
        if (variation.state !== 'done') {
            return { variation, results: null };
        }

        const kpis = await getKPIs(variationId, fetch);
        const newDisplayResults = ds.createDisplayResults();
        await ds.loadMoreResults({ displayResults: newDisplayResults, variationId, nResultsToLoad: nDisplayResultsToDownload });
        return { variation, results: { kpis, displayResults: newDisplayResults } };
    }

    if (displayResults !== null) {
        await ds.loadMoreResults({ displayResults, variationId, nResultsToLoad: nDisplayResultsToDownload });
        return "display-results-loaded";
    }

    return "unchanged";


}

async function getKPIs(variationId: string, fetchFunction: (...args: any[]) => Promise<Response>): Promise<KPIS | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;
    const bearerToken = auth.getAccessToken();

    const outputsArray = await tryGetJson<KPIS[]>({ endPoint, httpVerb: 'GET', bearerToken, fetchFunction });

    if (outputsArray === null) {
        return null;
    }

    return outputsArray[0];
}