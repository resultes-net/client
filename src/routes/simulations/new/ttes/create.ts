import { type TtesParametersInput } from "$lib/openapi/generated/model/ttesParametersInput";
import { createDefaultCollectorField } from "$lib/parameters/createDefaultCollectorField";
import { createDefaultControl } from "$lib/parameters/createDefaultControl";
import { createDefaultDemand } from "$lib/parameters/createDefaultDemand";
import { createDefaultWasteHeatRecoverySource } from "$lib/parameters/createDefaultWasteHeatRecoverySource";

export function createDefaultParameters(): TtesParametersInput {
    const defaultParameters: TtesParametersInput = {
        type: "ttes",
        time: { start: 0, stop: 3 * 365 * 24, dt_sim: 5 / 60 },
        demand: createDefaultDemand(),
        collector_field: createDefaultCollectorField(),
        waste_heat_recovery_source: createDefaultWasteHeatRecoverySource(),
        storage: {
            heat_conductance_kW_per_m2_per_K: 0.08e-3,
            ports_relative_heights_1: {
                top: 0.99,
                middle: 0.50,
                bottom: 0.01
            },
            volume: {
                scaling: "relative_to_collector_area_m3_per_m2",
                value: 1
            },
            height_to_diameter_ratio_1: 5,
            location: "above-ground-free-standing",

        },
        control: createDefaultControl()
    };

    return defaultParameters;
};
