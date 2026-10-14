import type { CostRegion } from '$lib/parameters/financial';

export interface KpisBase {
	demand: Demand;
	collectorField: CollectorField;
	storage: Storage;
	districtHeatingLosses_GWh: number;
	boilerEnergy_GWh: number;
	// All energy inputs: collector field, boiler, waste-heat source (TTES and PTES) and compressor (PTES and BTES).
	energyInputs_GWh: number;
	// Backwards compatibility: remove after 2027-04. `null` for results processed before the financial KPIs were introduced,
	// `LegacyFinancialKpis` for results processed before `OutputsVersion` was introduced (version 0).
	financial: LegacyFinancialKpis | FinancialKpis | null;
	// Backwards compatibility: remove after 2027-04. `null` for results processed before these outputs were introduced.
	sizes: Sizes | null;
}

export interface Demand {
	demand_GWh: number;
	averageSupplyTemp_degC: number;
	averageReturnTemp_degC: number;
}

export interface CollectorField {
	specificTotalIrradiation_MWh_per_m2: number;
	outputEnergy_GWh: number;
	specificOutputEnergy_MWh_per_m2: number;
	efficiency_1: number;
	nStagnationDays_1: number;
}

export interface Storage {
	charged_GWh: number;
	discharged_GWh: number;
	losses_GWh: number;
	roundTripEfficiency_1: number;
	netHeatGain_GWh: number;
	nChargingCycles_1: number;
}

export interface HeatPump {
	evaporatorEnergy_GWh: number;
	condenserEnergy_GWh: number;
	compressorEnergy_GWh: number;
	performanceFactor_1: number;
}

// The quantities the investment costs are based on.
export interface Sizes {
	collectorApertureArea_m2: number;
	storageVolumeWaterEquivalent_m3: number;
	// The maximum of the hourly averages.
	boilerCapacity_MW: number;
	// `null` for systems without a heat pump. The maximum of the hourly averages.
	heatPumpCapacity_MW: number | null;
}

// In the cost region's currency. From outputs version 1 on.
export interface FinancialKpis {
	outputsVersion: 1;
	costRegion: CostRegion;
	levelizedCostOfHeat_per_kWh: number;
	annuity: Annuity;
	investmentCost: InvestmentCost;
	// If the boiler, with the same efficiency, covered the whole demand.
	boilerOnlyFuelCost_per_a: number;
	// The whole storage investment per MWh discharged in one year: not comparable with the LCOH, which spreads the investment
	// over the calculation period.
	storageInvestmentPerDischarged_per_MWh: number;
}

// The yearly costs: capital, maintenance, fuel and electricity cost add up to the total.
export interface Annuity {
	total_per_a: number;
	capitalCost_per_a: number;
	maintenanceCost_per_a: number;
	// The boiler's fuel.
	fuel: YearlyEnergyCost;
	// The heat pump's compressor's, the only electricity accounted for. `null` for systems without a heat pump.
	electricity: YearlyEnergyCost | null;
}

export interface YearlyEnergyCost {
	cost_per_a: number;
	consumption_MWh: number;
}

export interface InvestmentCost {
	total: number;
	collectorField: {
		cost: number;
		specificCost_per_m2: number;
		apertureArea_m2: number;
	};
	storage: {
		cost: number;
		// Per m³ water equivalent.
		specificCost_per_m3: number;
		volumeWaterEquivalent_m3: number;
	};
	// `null` for systems without a heat pump.
	heatPump: {
		cost: number;
		// The maximum of the hourly averages.
		capacity_MW: number;
	} | null;
	boiler: {
		cost: number;
		// The maximum of the hourly averages.
		capacity_MW: number;
	};
}

// Backwards compatibility: remove after 2027-04. Results processed before `OutputsVersion` was introduced (version 0). In the
// cost region's currency.
export interface LegacyFinancialKpis {
	outputsVersion: 0;
	costRegion: CostRegion;
	levelizedCostOfHeat_per_kWh: number;
	annuity_per_a: number;
	investmentCost: LegacyInvestmentCost;
}

// Backwards compatibility: remove after 2027-04. See `LegacyFinancialKpis`.
export interface LegacyInvestmentCost {
	collectorField: number;
	storage: number;
	// The whole investment per MWh discharged in one year: not comparable with the LCOH, which spreads the investment over
	// the calculation period.
	storagePerDischarged_per_MWh: number;
	boiler: number;
	// `null` for systems without a heat pump.
	heatPump: number | null;
	total: number;
}
