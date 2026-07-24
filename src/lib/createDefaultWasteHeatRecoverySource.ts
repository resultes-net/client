import type { WasteHeatRecoverySource } from "./openapi/generated/model/wasteHeatRecoverySource";

const HOURS_IN_A_YEAR = 365 * 24;

export function createDefaultWasteHeatRecoverySource(): WasteHeatRecoverySource {
    const hourly_zeros = Array(HOURS_IN_A_YEAR).fill(0);

    const wasteHeatRecoverySource: WasteHeatRecoverySource = {
        name: "<disabled>",
        mass_flow_rates_kg_per_h: hourly_zeros,
        temperatures_deg_C: hourly_zeros
    }

    return wasteHeatRecoverySource;
}