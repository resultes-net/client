import type { CostRegion } from '$lib/parameters/financial';

export interface KpisBase {
	demand: Demand,
	collectorField: CollectorField,
	storage: Storage,
	districtHeatingLosses_GWh: number,
	boilerEnergy_GWh: number,
	// `null` for results that were processed before the financial KPIs were introduced.
	financial: FinancialKpis | null,
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