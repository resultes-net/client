import { createDefaultDemand } from "src/lib/createDefaultDemand";
import { createDefaultIam } from "src/lib/createDefaultIam";
import { PtesParametersInput } from "src/lib/openapi/generated/model/ptesParametersInput";


export function createDefaultParameters(): PtesParametersInput {
    const defaultParameters: PtesParametersInput = {
        type: "ptes",
        time: { start: 0, stop: 3 * 365 * 24, dt_sim: 5 / 60 },
        demand: createDefaultDemand(),
        collector_field: {
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
                a0: 0.737,
                a1_kW_per_m2_per_K: 0.0005,
                a2_kW_per_m2_per_K2: 6e-06,
                a3_kJ_per_m3_per_K: 0,
                a4_1: 0,
                a5_kJ_per_m2_per_K: 15.32
            },
            iam: createDefaultIam(),
            type: "flat-plate",
        },
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
        control: {
            demand_temperature_setpoint_degC: 80,
            demand_delta_T_degC: 30,
            storage_temperature_maximum_degC: 85,
        }
    };

    return defaultParameters;
};
