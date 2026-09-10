import type { HeatExchanger } from "src/lib/openapi/generated/model/heatExchanger";

export type HeatExchangerType = 'single-U' | 'double-U' | 'coaxial';

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

export function createDefault(heatExchangerType: HeatExchangerType): HeatExchanger {
    switch (heatExchangerType) {
        case "single-U": return createSingleUDefault();
        case "double-U": return createDoubleUDefault();
        case "coaxial": return createCoaxialDefault();
        default:
            throw new Error(`Unknown heat exchanger type: '${heatExchangerType}'`);
    }
}

export function areHeatExchangersEqual(
    heatExchanger1: HeatExchanger,
    heatExchanger2: HeatExchanger
): boolean {
    return (
        heatExchanger1.fluid_to_ground_resistance_m_K_per_W ===
        heatExchanger2.fluid_to_ground_resistance_m_K_per_W &&
        heatExchanger1.pipe_to_pipe_resistance_m_K_per_W ===
        heatExchanger2.pipe_to_pipe_resistance_m_K_per_W
    );
}

export function isSingleUDefault(heatExchanger: HeatExchanger) {
    return areHeatExchangersEqual(heatExchanger, createSingleUDefault());
}

export function isDoubleUDefault(heatExchanger: HeatExchanger) {
    return areHeatExchangersEqual(heatExchanger, createDoubleUDefault());
}

export function isCoaxialDefault(heatExchanger: HeatExchanger) {
    return areHeatExchangersEqual(heatExchanger, createCoaxialDefault());
}
