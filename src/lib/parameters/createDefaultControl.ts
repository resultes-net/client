import type { Control } from "src/lib/openapi/generated/model/control";

export function createDefaultControl(
    { storage_temperature_maximum_degC }: { storage_temperature_maximum_degC: number }
): Control {
    return {
        demand_temperature_setpoint_degC: 80,
        demand_delta_T_degC: 30,
        storage_temperature_maximum_degC,
    };
}
