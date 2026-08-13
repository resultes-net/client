import { type TtesParametersInput } from "$lib/openapi/generated/model/ttesParametersInput";
import { createDefaultCollectorField } from "$lib/parameters/createDefaultCollectorField";
import { createDefaultControl } from "$lib/parameters/createDefaultControl";
import { createDefaultDemand } from "$lib/parameters/createDefaultDemand";
import { createDefaultWasteHeatRecoverySource } from "$lib/parameters/createDefaultWasteHeatRecoverySource";

export function createDefaultParameters(): TtesParametersInput {
    const defaultParameters: TtesParametersInput = {
        type: "ttes",
        time: { start: 0, stop: 5 * 365 * 24, dt_sim: 5 / 60 },
        demand: createDefaultDemand(),
        collector_field: createDefaultCollectorField({ area_relative_to_demand_m2_per_MWh: 0.15 }),
        waste_heat_recovery_source: createDefaultWasteHeatRecoverySource(),
        storage: {
            insulation_thickness_cm: 20.0,
            ports_relative_heights_1: {
                top: 0.99,
                middle: 0.50,
                bottom: 0.01
            },
            volume: {
                scaling: "absolute_m3",
                value: 500
            },
            height_to_diameter_ratio_1: 5,
        },
        control: createDefaultControl( { storage_temperature_maximum_degC: 98 })
    };

    return defaultParameters;
};
