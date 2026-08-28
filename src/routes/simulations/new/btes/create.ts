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
        collector_field: createDefaultCollectorField({ area_relative_to_demand_m2_per_MWh: 1.0 }),
        waste_heat_recovery_source: createDefaultWasteHeatRecoverySource(),
        storage: {
            n_boreholes: {
                scaling: 'relative_to_collector_area_1_per_m2',
                value: 4e-3
            },
            borehole_depth_m: 70.0,
            borehole_spacing_m: 3.0
        },
        control: createDefaultControl({ storage_temperature_maximum_degC: 75 })
    };

    return defaultParameters;
};
