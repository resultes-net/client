import { createDefaultCollectorField } from "$lib/parameters/createDefaultCollectorField";
import { createDefaultControl } from "$lib/parameters/createDefaultControl";
import { createDefaultDemand } from "$lib/parameters/createDefaultDemand";
import { createDefaultWasteHeatRecoverySource } from "$lib/parameters/createDefaultWasteHeatRecoverySource";
import type { BtesParametersInput } from "src/lib/openapi/generated/model/btesParametersInput";

export function createDefaultParameters() {
    const defaultParameters: BtesParametersInput = {
        type: "btes",
        time: { start: 0, stop: 5 * 365 * 24, dt_sim: 5 / 60 },
        demand: createDefaultDemand(),
        collector_field: createDefaultCollectorField({ area_relative_to_demand_m2_per_MWh: 0.15 }),
        waste_heat_recovery_source: createDefaultWasteHeatRecoverySource(),
        storage: {
            volume: {
                scaling: "absolute_m3",
                value: 500
            },
        },
        control: createDefaultControl({ storage_temperature_maximum_degC: 98 })
    };

    return defaultParameters;
};
