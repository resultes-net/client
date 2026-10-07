import type { CostRegion } from '$lib/parameters/financial';
import type { FinancialKpis } from './kpis';

// Written by the systems' post-processing (`lcoh`), in the cost region's currency.
export interface FinancialOutputs {
    LCOH: number;
    annuity: number;
    I_solar: number;
    I_tes: number;
    I_boiler: number;
    I_hp: number;
    I_total: number;
}

const _FINANCIAL_OUTPUT_NAMES: (keyof FinancialOutputs)[] = [
    'LCOH',
    'annuity',
    'I_solar',
    'I_tes',
    'I_boiler',
    'I_hp',
    'I_total'
];

/**
 * Returns `null` for results that were processed before the financial outputs were introduced.
 * (The TTES' prototype wrote some of them, but in mixed currencies, and not `I_boiler` and `I_hp`.)
 */
export function createFinancialKpis(
    outputs: Partial<FinancialOutputs>,
    costRegion: CostRegion,
    storageDischarged_kWh: number,
    hasHeatPump: boolean
): FinancialKpis | null {
    if (!_hasAllFinancialOutputs(outputs)) {
        return null;
    }

    const storageDischarged_MWh = storageDischarged_kWh / 1e3;

    return {
        costRegion,
        levelizedCostOfHeat_per_kWh: outputs.LCOH,
        annuity_per_a: outputs.annuity,
        investmentCost: {
            collectorField: outputs.I_solar,
            storage: outputs.I_tes,
            storagePerDischarged_per_MWh: outputs.I_tes / storageDischarged_MWh,
            boiler: outputs.I_boiler,
            heatPump: hasHeatPump ? outputs.I_hp : null,
            total: outputs.I_total
        }
    };
}

function _hasAllFinancialOutputs(outputs: Partial<FinancialOutputs>): outputs is FinancialOutputs {
    return _FINANCIAL_OUTPUT_NAMES.every((name) => typeof outputs[name] === 'number');
}
