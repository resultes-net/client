import type { MassFlowRateAndTemperature } from "./openapi/generated/model/massFlowRateAndTemperature";
import type { WasteHeatRecoverySource } from "./openapi/generated/model/wasteHeatRecoverySource";

const HOURS_IN_A_YEAR = 365 * 24;

export function createDefaultWasteHeatRecoverySource(): WasteHeatRecoverySource {
    const hourly_values: MassFlowRateAndTemperature[] = Array.from({ length: HOURS_IN_A_YEAR }, () => ({ mass_flow_rate_kg_per_h: 0, temperature_deg_C: 0 }));

    const wasteHeatRecoverySource = {
        name: "<disabled>",
        hourly_values
    }

    return wasteHeatRecoverySource;
}