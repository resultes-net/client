export interface KpisBase {
	demand: Demand,
	collectorField: CollectorField,
	storage: Storage,
	districtHeatingLosses_GWh: number,
	boilerPower_GWh: number,
	investmentCost: InvestmentCost,
}

export interface Demand {
	demand_GWh: number,
	averageSupplyTemp_degC: number,
	averageReturnTemp_degC: number,
}

export interface CollectorField {
	specificTotalIrradiation_MWh_per_m2: number,
	outputPower_GWh: number,
	specificOutputPower_MWh_per_m2: number,
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
	evaporatorPower_GWh: number,
	condenserPower_GWh: number,
	compressorPower_GWh: number,
	performanceFactor_1: number,
}

export interface InvestmentCost {
	storage: StorageInvestmentCost
}

export interface StorageInvestmentCost {
	absolute_Euro: number,
	perDischarged_Euro_per_MWh: number,
}