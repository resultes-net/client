import type { BtesStorage } from "src/lib/openapi/generated/model/btesStorage";
import type { ScaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2 as NBoreholes } from "src/lib/openapi/generated/model/scaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2";

export function getNBoreholes(nBoreholes: NBoreholes, yearlyHeatDemandMWh: number, collectorFieldAreaM2: number): number {
    const { value: scaledNBoreholes, scaling: nBorholesScale } = nBoreholes;

    const scalingFactor = (
        {
            absolute_1: 1,
            relative_to_collector_area_1_per_m2: collectorFieldAreaM2,
            relative_to_demand_1_per_MWh: yearlyHeatDemandMWh
        } satisfies Record<NBoreholes.ScalingEnum, number>
    )[nBorholesScale];

    const nBoreholes1 = Math.ceil(scaledNBoreholes * scalingFactor);

    return nBoreholes1
}

export function getVolumeM3(storage: BtesStorage, yearlyHeatDemandMWh: number, collectorFieldAreaM2: number): number {
    const nBoreholes = getNBoreholes(storage.n_boreholes, yearlyHeatDemandMWh, collectorFieldAreaM2);
    const volume = nBoreholes *
        (0.525 * storage.borehole_spacing_m) ** 2 *
        Math.PI *
        storage.borehole_depth_m;
    return volume;
}
