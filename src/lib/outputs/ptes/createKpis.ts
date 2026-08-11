import { t } from '$lib/i18n/translations';
import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import type { CreateKpis, Kpi } from 'src/lib/outputs/kpis';


interface Outputs {
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreEff: number,
    pitStoreQAccum_kW_Tot: number,
}

export const createKpis: CreateKpis = async (variationId, fetchFunction) => {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];

        const kpis: Kpi[] = [
            { description: t.get('common.TesYearlyCharge'), formattedValue: (outputs.pitStoreQCharge_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { description: t.get('common.TesYearlyDischarge'), formattedValue: (outputs.pitStoreQDisharge_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { description: t.get('common.TesRoundTripEfficiency'), formattedValue: outputs.pitStoreEff.toFixed(2), unit: 'GWh', note: null },
            { description: t.get('common.TesYearlyNetHeatGain'), formattedValue: (outputs.pitStoreQAccum_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
        ]

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
