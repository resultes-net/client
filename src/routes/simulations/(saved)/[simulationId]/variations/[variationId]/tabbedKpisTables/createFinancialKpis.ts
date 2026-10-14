import type { CostRegion } from '$lib/parameters/financial';
import type { SizesOutputs } from './createSizes';
import type { FinancialKpis, LegacyFinancialKpis } from './kpis';

// Written by the systems' post-processing (`common/process/financial.py`), in the cost region's currency. From outputs
// version 1 on (`OutputsVersion`, written by `common/process/outputs.py`).
export interface FinancialOutputs extends SizesOutputs {
	OutputsVersion: number;
	LCOH: number;
	annuity: number;
	CapitalCost_per_a: number;
	MaintCost_per_a: number;
	FuelCost_per_a: number;
	FuelConsumption_kWh: number;
	// 0 without a heat pump.
	ElecCost_per_a: number;
	ElecConsumption_kWh: number;
	I_solar: number;
	I_solar_per_m2: number;
	I_tes: number;
	I_tes_per_m3: number;
	I_boiler: number;
	I_hp: number;
	I_total: number;
	BoilerOnlyFuelCost_per_a: number;
}

// Backwards compatibility: remove after 2027-04. The financial outputs of results processed before `OutputsVersion` was
// introduced (version 0).
type LegacyFinancialOutputs = Pick<
	FinancialOutputs,
	'LCOH' | 'annuity' | 'I_solar' | 'I_tes' | 'I_boiler' | 'I_hp' | 'I_total'
>;

// Backwards compatibility: remove after 2027-04. See `LegacyFinancialOutputs`.
const _LEGACY_FINANCIAL_OUTPUT_NAMES: (keyof LegacyFinancialOutputs)[] = [
	'LCOH',
	'annuity',
	'I_solar',
	'I_tes',
	'I_boiler',
	'I_hp',
	'I_total'
];

/**
 * Decides by `OutputsVersion` (missing means version 0) which financial KPIs the results have.
 *
 * Backwards compatibility: remove after 2027-04. Returns `LegacyFinancialKpis` for results processed before
 * `OutputsVersion` was introduced, and `null` for results processed before the financial outputs were introduced. (The
 * TTES' prototype wrote some of them, but in mixed currencies, and not `I_boiler` and `I_hp`.)
 */
export function createFinancialKpis(
	outputs: Partial<FinancialOutputs>,
	costRegion: CostRegion,
	storageDischarged_kWh: number,
	hasHeatPump: boolean
): LegacyFinancialKpis | FinancialKpis | null {
	const storageDischarged_MWh = storageDischarged_kWh / 1e3;

	// Backwards compatibility: remove after 2027-04. Results processed before `OutputsVersion` was introduced.
	if (outputs.OutputsVersion === undefined) {
		return _hasAllLegacyFinancialOutputs(outputs)
			? _createLegacyFinancialKpis(outputs, costRegion, storageDischarged_MWh, hasHeatPump)
			: null;
	}

	// From version 1 on, all financial outputs are there.
	return _createFinancialKpis(
		outputs as FinancialOutputs,
		costRegion,
		storageDischarged_MWh,
		hasHeatPump
	);
}

function _createFinancialKpis(
	outputs: FinancialOutputs,
	costRegion: CostRegion,
	storageDischarged_MWh: number,
	hasHeatPump: boolean
): FinancialKpis {
	return {
		outputsVersion: 1,
		costRegion,
		levelizedCostOfHeat_per_kWh: outputs.LCOH,
		annuity: {
			total_per_a: outputs.annuity,
			capitalCost_per_a: outputs.CapitalCost_per_a,
			maintenanceCost_per_a: outputs.MaintCost_per_a,
			fuel: {
				cost_per_a: outputs.FuelCost_per_a,
				consumption_MWh: outputs.FuelConsumption_kWh / 1e3
			},
			electricity: hasHeatPump
				? {
						cost_per_a: outputs.ElecCost_per_a,
						consumption_MWh: outputs.ElecConsumption_kWh / 1e3
					}
				: null
		},
		investmentCost: {
			total: outputs.I_total,
			collectorField: {
				cost: outputs.I_solar,
				specificCost_per_m2: outputs.I_solar_per_m2,
				apertureArea_m2: outputs.CollAcollAp
			},
			storage: {
				cost: outputs.I_tes,
				specificCost_per_m3: outputs.I_tes_per_m3,
				volumeWaterEquivalent_m3: outputs.TesVolWaterEq_m3
			},
			heatPump: hasHeatPump ? { cost: outputs.I_hp, capacity_MW: outputs.HpCap_kW / 1e3 } : null,
			boiler: { cost: outputs.I_boiler, capacity_MW: outputs.BolrCap_kW / 1e3 }
		},
		boilerOnlyFuelCost_per_a: outputs.BoilerOnlyFuelCost_per_a,
		storageInvestmentPerDischarged_per_MWh: outputs.I_tes / storageDischarged_MWh
	};
}

// Backwards compatibility: remove after 2027-04. See `LegacyFinancialOutputs`.
function _createLegacyFinancialKpis(
	outputs: LegacyFinancialOutputs,
	costRegion: CostRegion,
	storageDischarged_MWh: number,
	hasHeatPump: boolean
): LegacyFinancialKpis {
	return {
		outputsVersion: 0,
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

// Backwards compatibility: remove after 2027-04. Results processed before the financial outputs were introduced.
function _hasAllLegacyFinancialOutputs(
	outputs: Partial<FinancialOutputs>
): outputs is LegacyFinancialOutputs {
	return _LEGACY_FINANCIAL_OUTPUT_NAMES.every((name) => typeof outputs[name] === 'number');
}
