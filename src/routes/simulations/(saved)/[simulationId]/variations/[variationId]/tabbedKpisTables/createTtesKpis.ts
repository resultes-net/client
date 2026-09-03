import type { TtesParametersOutput } from '$lib/openapi/generated/model/ttesParametersOutput';
import { getAbsoluteVolumeFromTtesOrPtesParameters } from '$lib/parameters/toAbsolute';
import { FetchError } from 'src/ajax';
import { tryGetJson, UnauthorizedError, type FetchFunction } from 'src/authAjax';
import type { KpisBase, StorageInvestmentCost } from './kpis';


interface Outputs {
    IT_kW_m2: number,
    CollP_kW_calc_Tot: number,
    Q_kW_m2: number,
    TesQCharge_Tot: number,
    TesQDisharge_Tot: number,
    QLoss_Tes1_Tot: number,
    QDistrict_MW: number,
    QAcum_Tes1_Tot: number,
    BolrPOut_kW_Tot: number,
    QDemand_kW_Tot: number,
    SolarControlStagDays: number,
    TesEff: number,
    TesNCycles: number,
    QSnkTIn_Avg: number,
    QSnkTOut_Avg: number,
}

export interface TtesKpis extends KpisBase {
    type: 'ttes',
}

export async function createTtesKpis(
    variationId: string,
    parameters: TtesParametersOutput,
    redirectTo: string,
    fetchFunction: FetchFunction)
    : Promise<TtesKpis | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, redirectTo, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];

        const kpis: TtesKpis = {
            type: 'ttes',
            demand: {
                demand_GWh: outputs.QDemand_kW_Tot / 1e6,
                averageSupplyTemp_degC: outputs.QSnkTIn_Avg,
                averageReturnTemp_degC: outputs.QSnkTOut_Avg,
            },
            collectorField: {
                specificTotalIrradiation_MWh_per_m2: outputs.IT_kW_m2 / 1e3,
                outputPower_GWh: outputs.CollP_kW_calc_Tot / 1e6,
                specificOutputPower_MWh_per_m2: outputs.Q_kW_m2 / 1e3,
                efficiency_1: outputs.Q_kW_m2 / outputs.IT_kW_m2,
                nStagnationDays_1: outputs.SolarControlStagDays,
            },
            storage: {
                charged_GWh: outputs.TesQCharge_Tot / 1e6,
                discharged_GWh: outputs.TesQDisharge_Tot / 1e6,
                losses_GWh: outputs.QLoss_Tes1_Tot / 1e6,
                netHeatGain_GWh: outputs.QAcum_Tes1_Tot / 1e6,
                roundTripEfficiency_1: outputs.TesQCharge_Tot === 0 ? Infinity : outputs.TesEff,
                nChargingCycles_1: outputs.TesNCycles
            },
            boilerPower_GWh: outputs.BolrPOut_kW_Tot / 1e6,
            districtHeatingLosses_GWh: outputs.QDistrict_MW / 1e3,
            investmentCost: {
                storage: getStorageInvestmentCosts(parameters, outputs)
            }
        };

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}

function getStorageInvestmentCosts(parameters: TtesParametersOutput, outputs: Outputs): StorageInvestmentCost {
    const volumeM3 = getAbsoluteVolumeFromTtesOrPtesParameters(parameters);
    const perVolumeWaterEquivalentEuroPerM3 = 27102 * volumeM3 ** -0.527
    const absolute_Euro = perVolumeWaterEquivalentEuroPerM3 * volumeM3;
    const dischargedMWh = outputs.TesQDisharge_Tot / 1e3;
    const perDischarged_Euro_per_MWh = absolute_Euro / dischargedMWh;

    return { absolute_Euro, perDischarged_Euro_per_MWh };
}

