import { type TtesParametersInput } from "$lib/openapi/generated/model/ttesParametersInput";

export function createDefaultParameters(): TtesParametersInput {
    const defaultParameters: TtesParametersInput = {
        type: "ttes",
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
        storage: {
            heat_conductance_kW_per_m2_per_K: 0.08e-3,
            ports_relative_heights_1: {
                top: 0.99,
                middle: 0.50,
                bottom: 0.01
            },
            size: {
                size_type: "scaled-floor-area",
                floor_area_relative_to_demand_m2_per_GWh: 200,
                height_m: 20,
            },
            location: "above-ground-free-standing",
        }
    };

    return defaultParameters;
};
