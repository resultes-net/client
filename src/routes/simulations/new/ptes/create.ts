import { type PtesParameters } from "$lib/openapi/generated/model/ptesParameters";

export function createDefaultParameters(): PtesParameters {
    const defaultParameters: PtesParameters = {
        type: "ptes",
        demand: {
            profile: {
                profile_type: "predefined",
                name: "default",
            },
        },
        collector_field: {
            area: {
                scaling: "relative_to_demand_m2_per_GWh",
                value: 4.0
            },
            inclination_deg: 45.0,
            nominal_massflow: {
                scaling: "relative_to_collector_area_kg_per_h_m2",
                value: 15.0,
            },
            orientation_east_west_deg: 0.0,
            performance_coefficients: {
                a0: 0.857,
                a1_kW_per_m2_per_K: 4.16e-3,
                a2_kW_per_m2_per_K2: 0.0089e-3
            },
            type: "flat-plate"
        },
        storage: {}
    };

    return defaultParameters;
};
