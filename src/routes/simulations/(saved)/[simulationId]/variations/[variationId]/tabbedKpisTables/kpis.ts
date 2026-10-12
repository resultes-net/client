import type { CostRegion } from '$lib/parameters/financial';

export interface KpisBase {
	demand: Demand,
	collectorField: CollectorField,
	storage: Storage,
	districtHeatingLosses_GWh: number,
	boilerEnergy_GWh: number,
	// Backwards compatibility: remove after 2027-04. `null` for results processed before the financial KPIs were introduced.
	financial: FinancialKpis | null,
	// Backwards compatibility: remove after 2027-04. `null` for results processed before these outputs were introduced.
	sizes: Sizes | null,
}

export interface Demand {
	demand_GWh: number,
	averageSupplyTemp_degC: number,
	averageReturnTemp_degC: number,
}

export interface CollectorField {
	specificTotalIrradiation_MWh_per_m2: number,
	outputEnergy_GWh: number,
	specificOutputEnergy_MWh_per_m2: number,
	efficiency_1: number,
	nStagnationDays_1: number,
}

export interface Storage {
	charged_GWh: number,
	discharged_GWh: number,
	losses_GWh: number,
	roundTripEfficiency_1: number,
	netHeatGain_GWh: number,
	nChargingCycles_1: number,
}

export interface HeatPump {
	evaporatorEnergy_GWh: number,
	condenserEnergy_GWh: number,
	compressorEnergy_GWh: number,
	performanceFactor_1: number,
}

// The quantities the investment costs are based on.
export interface Sizes {
	collectorApertureArea_m2: number,
	storageVolumeWaterEquivalent_m3: number,
	// The maximum of the hourly averages.
	boilerCapacity_MW: number,
	// `null` for systems without a heat pump. The maximum of the hourly averages.
	heatPumpCapacity_MW: number | null,
}

// In the cost region's currency.
export interface FinancialKpis {
	costRegion: CostRegion,
	levelizedCostOfHeat_per_kWh: number,
	annuity_per_a: number,
	investmentCost: InvestmentCost,
}

export interface InvestmentCost {
	collectorField: number,
	storage: number,
	// The whole investment per MWh discharged in one year: not comparable with the LCOH, which spreads the investment over
	// the calculation period.
	storagePerDischarged_per_MWh: number,
	boiler: number,
	// `null` for systems without a heat pump.
	heatPump: number | null,
	total: number,
}