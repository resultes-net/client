import type { BtesParametersOutput } from '$lib/openapi/generated/model/btesParametersOutput';
import { getVolumeM3FromParameters } from '$lib/parameters/toAbsolute/btes';
import { FetchError, UnauthorizedError, type FetchFunction } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';
import type { HeatPump, KpisBase, StorageInvestmentCost } from './kpis';


interface Outputs {
    IT_kW_m2: number,
    CollP_kW_calc_Tot: number,
    Q_kW_m2: number,
    BoHxQChar_kW_Tot: number,
    BoHxQDischar_kW_Tot: number,
    BoHxQLoss_kW_Tot: number,
    BoHxQLossTop_kW_Tot: number,
    BoHxQLossSide_kW_Tot: number,
    BoHxQLossBot_kW_Tot: number,
    QDistrict_MW: number,
    BoHxQAccum_kW_Tot: number,
    HpQEvap_kW_Tot: number,
    HpQCond_kW_Tot: number,
    HpPelComp_kW_Tot: number,
    BolrPOut_kW_Tot: number,
    QDemand_kW_Tot: number,
    SolarControlStagDays: number,
    HpCOP: number,
    BoHxEff: number,
    BoHxNCycles: number,
    QSnkTIn_Avg: number,
    QSnkTOut_Avg: number
}

export interface BtesKpis extends KpisBase {
    type: 'btes',
    heatPump: HeatPump,
}

const _CP_BTES_KJ_PER_M3_K = 2016.0
const _CP_WATER_KJ_PER_KG_K = 4.19
const _RHO_WATER_KG_PER_M3 = 998.0
const _CP_WATER_KJ_PER_M3_K = _CP_WATER_KJ_PER_KG_K * _RHO_WATER_KG_PER_M3

export async function createBtesKpis(
    variationId: string,
    parameters: BtesParametersOutput,
    redirectTo: string,
    fetchFunction: FetchFunction)
    : Promise<BtesKpis | null> {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, redirectTo, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];


        const kpis: BtesKpis = {
            type: 'btes',
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
                charged_GWh: outputs.BoHxQChar_kW_Tot / 1e6,
                discharged_GWh: outputs.BoHxQDischar_kW_Tot / 1e6,
                losses_GWh: outputs.BoHxQLoss_kW_Tot / 1e6,
                netHeatGain_GWh: outputs.BoHxQAccum_kW_Tot / 1e6,
                roundTripEfficiency_1: outputs.BoHxQChar_kW_Tot === 0 ? Infinity : outputs.BoHxEff,
                nChargingCycles_1: outputs.BoHxNCycles
            },
            heatPump: {
                evaporatorPower_GWh: outputs.HpQEvap_kW_Tot / 1e6,
                compressorPower_GWh: outputs.HpPelComp_kW_Tot / 1e6,
                condenserPower_GWh: outputs.HpQCond_kW_Tot / 1e6,
                performanceFactor_1: outputs.HpCOP,
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

function getStorageInvestmentCosts(parameters: BtesParametersOutput, outputs: Outputs): StorageInvestmentCost {
    const volumeM3 = getVolumeM3FromParameters(parameters);
    const cpRatio = _CP_BTES_KJ_PER_M3_K / _CP_WATER_KJ_PER_M3_K;
    const volumeWaterEquivalentM3 = volumeM3 / cpRatio;
    const perVolumeWaterEquivalentEuroPerM3 = 472.54 * volumeWaterEquivalentM3 ** -0.225
    const absolute_Euro = perVolumeWaterEquivalentEuroPerM3 * volumeWaterEquivalentM3;
    const dischargedMWh = outputs.BoHxQDischar_kW_Tot / 1e3;
    const perDischarged_Euro_per_MWh = absolute_Euro / dischargedMWh;

    return { absolute_Euro, perDischarged_Euro_per_MWh };
}
