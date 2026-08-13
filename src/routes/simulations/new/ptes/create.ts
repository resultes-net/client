import { PtesParametersInput } from "$lib/openapi/generated/model/ptesParametersInput";
import { createDefaultCollectorField } from "$lib/parameters/createDefaultCollectorField";
import { createDefaultControl } from "$lib/parameters/createDefaultControl";
import { createDefaultDemand } from "$lib/parameters/createDefaultDemand";
import { createDefaultWasteHeatRecoverySource } from "$lib/parameters/createDefaultWasteHeatRecoverySource";


export function createDefaultParameters(): PtesParametersInput {
    const defaultParameters: PtesParametersInput = {
        type: "ptes",
        time: { start: 0, stop: 3 * 365 * 24, dt_sim: 5 / 60 },
        demand: createDefaultDemand(),
        collector_field: createDefaultCollectorField({ area_relative_to_demand_m2_per_MWh: 2.0 }),
        waste_heat_recovery_source: createDefaultWasteHeatRecoverySource(),
        storage: {
            volume: {
                scaling: "relative_to_collector_area_m3_per_m2",
                value: 1.0
            },
            ports_relative_heights_1: {
                top: 0.95,
                middle: 0.50,
                bottom: 0.05,
            }
        },
        control: createDefaultControl( { storage_temperature_maximum_degC: 85 })
    };

    return defaultParameters;
};




