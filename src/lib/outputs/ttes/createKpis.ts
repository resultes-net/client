import type { CreateKpis, Kpi } from '$lib/outputs/kpis';
import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';

interface Outputs {
    TesQCharge_Tot: number,
    TesQDisharge_Tot: number,
    TesEff: number,
    QAcum_Tes1_MW: number,
}



export const createKpis: CreateKpis = async (variationId, fetchFunction) => {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];

        const kpis: Kpi[] = [
            { descriptionKey: 'common.TesYearlyCharge', formattedValue: (outputs.TesQCharge_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.TesYearlyDischarge', formattedValue: (outputs.TesQDisharge_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.TesRoundTripEfficiency', formattedValue: outputs.TesEff === null ? 'null' : outputs.TesEff.toFixed(2), unit: '-', note: null },
            { descriptionKey: 'common.TesYearlyNetHeatGain', formattedValue: (outputs.QAcum_Tes1_MW / 1000).toFixed(2), unit: 'GWh', note: null },
        ]

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
