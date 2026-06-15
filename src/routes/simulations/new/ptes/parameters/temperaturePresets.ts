import { type Temperatures } from '$lib/openapi/generated/model/temperatures';

export const DEFAULT_DEMAND_SETPOINT_DEGC = 80;

// Offsets, in Kelvin, added to the demand setpoint temperature to preset
// the remaining temperatures
export const BOILER_OUTPUT_SETPOINT_OFFSET_K = 0;
export const HEAT_PUMP_OUTPUT_SETPOINT_OFFSET_K = 0;
export const STORAGE_MAXIMUM_OFFSET_K = 5;
export const COLLECTOR_MAXIMUM_OFFSET_K = 15;

export function createPresetTemperatures(demandSetpointDegC: number): Temperatures {
	return {
		demand_setpoint_degC: demandSetpointDegC,
		boiler_output_setpoint_degC: demandSetpointDegC + BOILER_OUTPUT_SETPOINT_OFFSET_K,
		heat_pump_output_setpoint_degC: demandSetpointDegC + HEAT_PUMP_OUTPUT_SETPOINT_OFFSET_K,
		storage_maximum_degC: demandSetpointDegC + STORAGE_MAXIMUM_OFFSET_K
	};
}
