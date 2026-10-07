import type { PtesParametersOutput } from '$lib/openapi/generated/model/ptesParametersOutput';
import { FetchError, UnauthorizedError, type FetchFunction } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import { createFinancialKpis, type FinancialOutputs } from './createFinancialKpis';
import type { HeatPump, KpisBase } from './kpis';


interface Outputs extends Partial<FinancialOutputs> {
    IT_kW_m2: number,
    CollP_kW_calc_Tot: number,
    Q_kW_m2: number,
    pitStoreQCharge_Tot: number,
    pitStoreQDisharge_Tot: number,
    pitStoreQLosses_kW_Tot: number,
    pitStoreQLossesTo_kW_Tot: number,
    pitStoreQLossesEd_kW_Tot: number,
    pitStoreQLossesBo_kW_Tot: number,
    QDistrict_MW: number,
    pitStoreQAccum_kW_Tot: number,
    HxQ_kW_Tot: number,
    HpQEvap_kW_Tot: number,
    HpQCond_kW_Tot: number,
    HpPelComp_kW_Tot: number,
    BolrPOut_kW_Tot: number,
    QDemand_kW_Tot: number,
    SolarControlStagDays: number,
    HpCOP: number,
    pitStoreEff: number,
    pitStoreNCycles: number,
    QSnkTIn_Avg: number,
    QSnkTOut_Avg: number,
}

export interface PtesKpis extends KpisBase {
    type: 'ptes',
    heatPump: HeatPump,
}

export async function createPtesKpis(
    variationId: string,
    parameters: PtesParametersOutput,
    redirectTo: string,
    fetchFunction: FetchFunction)
    : Promise<PtesKpis | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, redirectTo, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];

        const kpis: PtesKpis = {
            type: 'ptes',
            demand: {
                demand_GWh: outputs.QDemand_kW_Tot / 1e6,
                averageSupplyTemp_degC: outputs.QSnkTIn_Avg,
                averageReturnTemp_degC: outputs.QSnkTOut_Avg,
            },
            collectorField: {
                specificTotalIrradiation_MWh_per_m2: outputs.IT_kW_m2 / 1e3,
                outputEnergy_GWh: outputs.CollP_kW_calc_Tot / 1e6,
                specificOutputEnergy_MWh_per_m2: outputs.Q_kW_m2 / 1e3,
                efficiency_1: outputs.Q_kW_m2 / outputs.IT_kW_m2,
                nStagnationDays_1: outputs.SolarControlStagDays,
            },
            storage: {
                charged_GWh: outputs.pitStoreQCharge_Tot / 1e6,
                discharged_GWh: outputs.pitStoreQDisharge_Tot / 1e6,
                losses_GWh: outputs.pitStoreQLosses_kW_Tot / 1e6,
                netHeatGain_GWh: outputs.pitStoreQAccum_kW_Tot / 1e6,
                roundTripEfficiency_1: outputs.pitStoreQCharge_Tot === 0 ? Infinity : outputs.pitStoreEff,
                nChargingCycles_1: outputs.pitStoreNCycles
            },
            heatPump: {
                evaporatorEnergy_GWh: outputs.HpQEvap_kW_Tot / 1e6,
                compressorEnergy_GWh: outputs.HpPelComp_kW_Tot / 1e6,
                condenserEnergy_GWh: outputs.HpQCond_kW_Tot / 1e6,
                performanceFactor_1: outputs.HpCOP,
            },
            boilerEnergy_GWh: outputs.BolrPOut_kW_Tot / 1e6,
            districtHeatingLosses_GWh: outputs.QDistrict_MW / 1e3,
            financial: createFinancialKpis(
                outputs, parameters.financial.cost_region, outputs.pitStoreQDisharge_Tot, true
            )
        };

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
