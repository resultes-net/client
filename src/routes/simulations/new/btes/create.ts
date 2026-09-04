import { createDefaultCollectorField } from "$lib/parameters/createDefaultCollectorField";
import { createDefaultControl } from "$lib/parameters/createDefaultControl";
import { createDefaultDemand } from "$lib/parameters/createDefaultDemand";
import { createDefaultWasteHeatRecoverySource } from "$lib/parameters/createDefaultWasteHeatRecoverySource";
import type { BtesParametersInput } from "src/lib/openapi/generated/model/btesParametersInput";
import type { HeatExchanger } from "src/lib/openapi/generated/model/heatExchanger";

export namespace HeatExchangers {
	// Values taken from here:
	// https://consensus.app/search/borehole-thermal-energy-storage/hZwGchREQqSNOgJnRaCUAQ/
    
    export function createSingleUDefault(): HeatExchanger {
        return {
            fluid_to_ground_resistance_m_K_per_W: 0.1,
            pipe_to_pipe_resistance_m_K_per_W: 0.18
        };
    }

    export function createDoubleUDefault(): HeatExchanger {
        return {
            fluid_to_ground_resistance_m_K_per_W: 0.08,
            pipe_to_pipe_resistance_m_K_per_W: 0.11
        };
    }

    export function createCoaxialDefault(): HeatExchanger {
        return { fluid_to_ground_resistance_m_K_per_W: 0.04, pipe_to_pipe_resistance_m_K_per_W: 0.25 };
    }
}

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
            borehole_spacing_m: 3.0,
            heat_exchanger: HeatExchangers.createDoubleUDefault()
        },
        control: createDefaultControl({ storage_temperature_maximum_degC: 95 })
    };

    return defaultParameters;
};
