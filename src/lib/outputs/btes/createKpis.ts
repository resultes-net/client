import type { CreateKpis, Kpi } from '$lib/outputs/kpis';
import { FetchError, UnauthorizedError } from 'src/ajax';
import { tryGetJson } from 'src/authAjax';


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

export const createKpis: CreateKpis = async (variationId, fetchFunction) => {
    const endPoint = `/variations/${variationId}/results/output.json`;

    try {
        const outputsArray = await tryGetJson<Outputs[]>({ endPoint, httpVerb: 'GET', fetchFunction });
        const outputs = outputsArray[0];

        function formatPercentageRelativeToDemand(absolute: number, conversionFactor: number = 1): string {
            const convertedAbsolute = absolute * conversionFactor;
            const relative = convertedAbsolute / outputs.QDemand_kW_Tot;
            const formatted = `${(relative * 100).toFixed(2)} %`
            return formatted;
        }

        const kpis: Kpi[] = [
            { descriptionKey: 'common.CollectorFieldYearlyTotalSolarIrradiation', formattedValue: outputs.IT_kW_m2.toFixed(2), unit: 'kW m<sup>-2</sup>', note: null },
            {
                descriptionKey: 'common.CollectorFieldYearlyTotalPowerOutput',
                formattedValue: (outputs.CollP_kW_calc_Tot / 1000 / 1000).toFixed(2),
                unit: 'GWh',
                note: `${outputs.Q_kW_m2.toFixed(2)} kW m<sup>-2</sup> | ${formatPercentageRelativeToDemand(outputs.CollP_kW_calc_Tot)}`
            },
            { descriptionKey: 'common.CollectorFieldStagnationDays', formattedValue: outputs.SolarControlStagDays.toFixed(2), unit: '-', note: null },
            { descriptionKey: 'common.TesYearlyCharge', formattedValue: (outputs.BoHxQChar_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            {
                descriptionKey: 'common.TesYearlyDischarge',
                formattedValue: (outputs.BoHxQDischar_kW_Tot / 1000 / 1000).toFixed(2),
                unit: 'GWh',
                note: `${formatPercentageRelativeToDemand(outputs.BoHxQDischar_kW_Tot)}`
            },
            { descriptionKey: 'common.TesYearlyDischarge', formattedValue: (outputs.BoHxQLoss_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null, },
            { descriptionKey: 'common.TesYearlyDischarge', formattedValue: (outputs.BoHxQLossTop_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null, },
            { descriptionKey: 'common.TesYearlyDischarge', formattedValue: (outputs.BoHxQLossSide_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null, },
            { descriptionKey: 'common.TesYearlyDischarge', formattedValue: (outputs.BoHxQLossBot_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null, },
            { descriptionKey: 'common.TesRoundTripEfficiency', formattedValue: outputs.BoHxEff.toFixed(2), unit: '-', note: null },
            { descriptionKey: 'common.TesYearlyNetHeatGain', formattedValue: (outputs.BoHxQAccum_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.TesNumberOfCyclesOverOneYear', formattedValue: outputs.BoHxNCycles.toFixed(2), unit: '-', note: null },
            { descriptionKey: 'common.HPYearlyEvaporatorPower', formattedValue: (outputs.HpQEvap_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.HPYearlyCondenserPower', formattedValue: (outputs.HpQCond_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.HPYearlyCompressorPower', formattedValue: (outputs.HpPelComp_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: null },
            { descriptionKey: 'common.HPAnnualPerformanceFactor', formattedValue: outputs.HpCOP.toFixed(2), unit: '-', note: null },
            {
                descriptionKey: 'common.BoilerAnnualPower',
                formattedValue: (outputs.BolrPOut_kW_Tot / 1000 / 1000).toFixed(2),
                unit: 'GWh',
                note: `${formatPercentageRelativeToDemand(outputs.BolrPOut_kW_Tot)}`
            },
            { descriptionKey: 'common.YearlyAverageSupplyTemperature', formattedValue: outputs.QSnkTIn_Avg.toFixed(2), unit: '°C', note: null },
            { descriptionKey: 'common.YearlyAverageReturnTemperature', formattedValue: outputs.QSnkTOut_Avg.toFixed(2), unit: '°C', note: null },
            { descriptionKey: 'common.yearlyHeatDemand', formattedValue: (outputs.QDemand_kW_Tot / 1000 / 1000).toFixed(2), unit: 'GWh', note: '100 %' },
            {
                descriptionKey: 'common.DistrictHeatingLosses',
                formattedValue: (outputs.QDistrict_MW / 1000).toFixed(2),
                unit: 'GWh',
                note: `${formatPercentageRelativeToDemand(outputs.QDistrict_MW, 1000)}`
            },
        ]

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
