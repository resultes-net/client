import { Financial } from '$lib/openapi/generated/model/financial';
import type { PowerLawCost } from '$lib/openapi/generated/model/powerLawCost';
import type { Type } from '$lib/openapi/generated/model/type';

export type CostRegion = Financial.CostRegionEnum;

export const DEFAULT_COST_REGION: CostRegion = Financial.CostRegionEnum.Eu;

export interface CostRegionDefinition {
    currency: 'EUR' | 'CHF';
    currencySymbol: string;
    // Applies to the investment costs only: they are given in EUR at EU prices (`BASE_*` below)
    // and multiplied by this factor. It covers both the currency and the price level.
    localisationFactor: number;
    // Not localised: these are the actual local prices.
    // TODO: The marked defaults are guesses, not researched values (resultes-net/issues#38).
    defaultFuelPrice_per_kWh: number;
    defaultElectricityPrice_per_kWh: number;
}

export const COST_REGIONS: Record<CostRegion, CostRegionDefinition> = {
    eu: {
        currency: 'EUR',
        currencySymbol: '€',
        localisationFactor: 1,
        defaultFuelPrice_per_kWh: 0.08,
        defaultElectricityPrice_per_kWh: 0.2 // Guess.
    },
    ch: {
        currency: 'CHF',
        currencySymbol: 'CHF',
        // Final report, section 4.2.1.
        localisationFactor: 1.24,
        defaultFuelPrice_per_kWh: 0.075, // Guess.
        defaultElectricityPrice_per_kWh: 0.19 // Guess.
    }
};

// Power laws `a * x**b` in EUR, from section 4.2 of the final report. `x` is the storage volume
// in m³ water equivalent.
export const BASE_STORAGE_COSTS_EUR: Record<Type, PowerLawCost> = {
    ttes: { a: 27102, b: -0.527 },
    ptes: { a: 19142, b: -0.539 },
    btes: { a: 472.54, b: -0.225 }
};

// `x` is the collector aperture area in m². The final report gives this curve in CHF (eq. 8),
// so it's converted to EUR with the report's localisation factor.
export const BASE_COLLECTOR_FIELD_COST_EUR: PowerLawCost = { a: 1330.12 / 1.24, b: -0.0873 };

// Per kW_th, final report, table 6 (HTHP ≤ 125 °C and gas boiler).
export const BASE_HEAT_PUMP_COST_EUR_PER_KW = 954.1;
export const BASE_BOILER_COST_EUR_PER_KW = 250;

export function createDefaultFinancial(
    systemType: Type,
    costRegion: CostRegion = DEFAULT_COST_REGION
): Financial {
    const region = COST_REGIONS[costRegion];
    const factor = region.localisationFactor;
    const storageCost = BASE_STORAGE_COSTS_EUR[systemType];

    return {
        cost_region: costRegion,
        real_discount_rate_1: 0.03,
        fuel_price_per_kWh: region.defaultFuelPrice_per_kWh,
        electricity_price_per_kWh: region.defaultElectricityPrice_per_kWh,
        lifetime_a: 30,
        maintenance_rate_1: 0.01,
        boiler_efficiency_1: 0.9,
        storage_cost: { a: storageCost.a * factor, b: storageCost.b },
        collector_field_cost: {
            a: BASE_COLLECTOR_FIELD_COST_EUR.a * factor,
            b: BASE_COLLECTOR_FIELD_COST_EUR.b
        },
        heat_pump_cost_per_kW: BASE_HEAT_PUMP_COST_EUR_PER_KW * factor,
        boiler_cost_per_kW: BASE_BOILER_COST_EUR_PER_KW * factor
    };
}

type InvestmentCosts = [
    storageCostA: number,
    collectorFieldCostA: number,
    heatPumpCost_per_kW: number,
    boilerCost_per_kW: number
];

function getInvestmentCosts(financial: Financial): InvestmentCosts {
    return [
        financial.storage_cost.a,
        financial.collector_field_cost.a,
        financial.heat_pump_cost_per_kW,
        financial.boiler_cost_per_kW
    ];
}

function setInvestmentCosts(financial: Financial, costs: InvestmentCosts): void {
    [
        financial.storage_cost.a,
        financial.collector_field_cost.a,
        financial.heat_pump_cost_per_kW,
        financial.boiler_cost_per_kW
    ] = costs;
}

export interface CostRegionSwitch {
    from: CostRegion;
    to: CostRegion;
    costsBefore: InvestmentCosts;
    costsAfter: InvestmentCosts;
}

export interface SwitchCostRegionResult {
    // Pass this to the next call, so that switching back is exact.
    lastSwitch: CostRegionSwitch;
    // Whether the energy prices had been changed from the old region's defaults.
    wereEditedEnergyPricesReset: boolean;
}

/**
 * Switches `financial` to `newCostRegion`, in place.
 *
 * The investment costs are converted with the ratio of the regions' localisation factors, so that
 * the user's edits are kept, just localised. The energy prices are reset to the new region's
 * defaults. The other parameters are region-independent and stay.
 *
 * Converting there and back with floating point numbers isn't always exact. So, if `lastSwitch`
 * is the opposite switch and a cost hasn't been changed since, its value from before that switch
 * is restored instead.
 */
export function switchCostRegion(
    financial: Financial,
    newCostRegion: CostRegion,
    lastSwitch: CostRegionSwitch | null
): SwitchCostRegionResult {
    const oldCostRegion = financial.cost_region;
    const oldRegion = COST_REGIONS[oldCostRegion];
    const newRegion = COST_REGIONS[newCostRegion];

    const costsBefore = getInvestmentCosts(financial);

    const isSwitchingBack =
        lastSwitch !== null && lastSwitch.from === newCostRegion && lastSwitch.to === oldCostRegion;

    const factor = newRegion.localisationFactor / oldRegion.localisationFactor;
    const costsAfter = costsBefore.map((cost, i) =>
        isSwitchingBack && cost === lastSwitch.costsAfter[i] ? lastSwitch.costsBefore[i] : cost * factor
    ) as InvestmentCosts;

    setInvestmentCosts(financial, costsAfter);

    const wereEditedEnergyPricesReset =
        financial.fuel_price_per_kWh !== oldRegion.defaultFuelPrice_per_kWh ||
        financial.electricity_price_per_kWh !== oldRegion.defaultElectricityPrice_per_kWh;

    financial.fuel_price_per_kWh = newRegion.defaultFuelPrice_per_kWh;
    financial.electricity_price_per_kWh = newRegion.defaultElectricityPrice_per_kWh;

    financial.cost_region = newCostRegion;

    return {
        lastSwitch: { from: oldCostRegion, to: newCostRegion, costsBefore, costsAfter },
        wereEditedEnergyPricesReset
    };
}
