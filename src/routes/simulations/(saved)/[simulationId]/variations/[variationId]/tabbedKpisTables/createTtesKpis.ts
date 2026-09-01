import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import type { CreateKpis } from './createKpis';
import type { KpisBase } from './kpis';


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

export const createTtesKpis: CreateKpis = async (variationId, redirectTo, fetchFunction) => {
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
