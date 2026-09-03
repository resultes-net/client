import type { Demand } from "../openapi/generated/model/demand";
import type { PtesParametersOutput } from "../openapi/generated/model/ptesParametersOutput";
import type { ScaledValueLiteralAbsoluteM2RelativeToDemandM2PerMWh as Area } from "../openapi/generated/model/scaledValueLiteralAbsoluteM2RelativeToDemandM2PerMWh";
import type { ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2 as Volume } from "../openapi/generated/model/scaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2";
import type { TtesParametersOutput } from "../openapi/generated/model/ttesParametersOutput";

export function getYearlyHeatDemandMWh(demand: Demand): number {
    const yearlyHeatDemandMWh = demand.hourly_heat_demand_MW.reduce(
        (s, p) => s + demand.scaling_factor * p,
        0
    );

    return yearlyHeatDemandMWh;
}

export function getAbsoluteAreaM2(area: Area, yearlyHeatDemandMWh: number): number {
    const scalingFactor =
        area.scaling === 'relative_to_demand_m2_per_MWh' ? yearlyHeatDemandMWh : 1.0;
    const collectorFieldAreaM2 = area.value * scalingFactor;

    return collectorFieldAreaM2;
}

export function getAbsoluteVolumeM3(volume: Volume, yearlyHeatDemandMWh: number, collectorFieldAreaM2: number): number {
    const { value: scaledVolume, scaling: volumeScale } = volume;

    const scalingFactor = (
        {
            absolute_m3: 1,
            relative_to_collector_area_m3_per_m2: collectorFieldAreaM2,
            relative_to_demand_m3_per_MWh: yearlyHeatDemandMWh
        } satisfies Record<Volume.ScalingEnum, number>
    )[volumeScale];

    const absoluteVolumeM3 = scaledVolume * scalingFactor;

    return absoluteVolumeM3;
}

export function getAbsoluteVolumeFromTtesOrPtesParameters(parameters: TtesParametersOutput | PtesParametersOutput): number {
    const yearlyHeatDemandMWh = getYearlyHeatDemandMWh(parameters.demand);
    const collectorFieldAreaM2 = getAbsoluteAreaM2(parameters.collector_field.area, yearlyHeatDemandMWh);
    const volumeM3 = getAbsoluteVolumeM3(parameters.storage.volume, yearlyHeatDemandMWh, collectorFieldAreaM2);
    return volumeM3;
}
