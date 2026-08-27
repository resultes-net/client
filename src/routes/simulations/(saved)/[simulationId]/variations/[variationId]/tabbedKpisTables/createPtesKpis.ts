import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import type { CreateKpis, HeatPump, KpisBase } from './kpis';


interface Outputs {
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

export const createPtesKpis: CreateKpis = async (variationId, fetchFunction) => {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', fetchFunction });
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
                outputPower_GWh: outputs.CollP_kW_calc_Tot / 1e6,
                specificOutputPower_MWh_per_m2: outputs.Q_kW_m2 / 1e3,
                performanceFactor_1: outputs.Q_kW_m2 / outputs.IT_kW_m2,
                nStagnationDays_1: outputs.SolarControlStagDays,
            },
            storage: {
                charged_GWh: outputs.pitStoreQCharge_Tot / 1e6,
                discharged_GWh: outputs.pitStoreQDisharge_Tot / 1e6,
                losses_GWh: outputs.pitStoreQLosses_kW_Tot / 1e6,
                netHeatGain_GWh: outputs.pitStoreQAccum_kW_Tot / 1e6,
                roundTripEfficiency_1: outputs.pitStoreEff,
                nChargingCycles_1: outputs.pitStoreNCycles
            },
            heatPump: {
                evaporatorPower_GWh: outputs.HpQEvap_kW_Tot / 1e6,
                compressorPower_GWh: outputs.HpPelComp_kW_Tot / 1e6,
                condenserPower_GWh: outputs.HpQCond_kW_Tot / 1e6,
                performanceFactor_1: outputs.HpCOP,
            },
            boilerPower_GWh: outputs.BolrPOut_kW_Tot / 1e6,
            districtHeatingLosses_GWh: outputs.QDistrict_MW / 1e3
        };

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
