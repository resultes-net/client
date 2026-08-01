import type { CollectorField } from "$lib/openapi/generated/model/collectorField";
import { createDefaultIam } from "$lib/parameters/createDefaultIam";

export function createDefaultCollectorField(): CollectorField {
    return {
        area: {
            scaling: "relative_to_demand_m2_per_MWh",
            value: 2.0
        },
        inclination_deg: 45.0,
        nominal_massflow: {
            scaling: "relative_to_collector_area_kg_per_h_m2",
            value: 15.0,
        },
        orientation_east_west_deg: 0.0,
        performance_coefficients: {
            a0_1: 0.737,
            a1_kW_per_m2_per_K: 0.0005,
            a2_kW_per_m2_per_K2: 6e-06,
            a3_kJ_per_m3_per_K: 0,
            a4_1: 0,
            a5_kJ_per_m2_per_K: 15.32
        },
        iam: createDefaultIam(),
        type: "flat-plate",
    };
}
