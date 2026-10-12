import type { Sizes } from './kpis';

// Written by the systems' post-processing (`lcoh`). `CollAcollAp` is a deck variable.
export interface SizesOutputs {
	CollAcollAp: number;
	TesVolWaterEq_m3: number;
	BolrCap_kW: number;
	// 0 without a heat pump.
	HpCap_kW: number;
}

const _SIZES_OUTPUT_NAMES: (keyof SizesOutputs)[] = [
	'CollAcollAp',
	'TesVolWaterEq_m3',
	'BolrCap_kW',
	'HpCap_kW'
];

/**
 * Backwards compatibility: remove after 2027-04. Returns `null` for results processed before the sizes were introduced.
 */
export function createSizes(outputs: Partial<SizesOutputs>, hasHeatPump: boolean): Sizes | null {
	if (!_hasAllSizesOutputs(outputs)) {
		return null;
	}

	return {
		collectorApertureArea_m2: outputs.CollAcollAp,
		storageVolumeWaterEquivalent_m3: outputs.TesVolWaterEq_m3,
		boilerCapacity_MW: outputs.BolrCap_kW / 1e3,
		heatPumpCapacity_MW: hasHeatPump ? outputs.HpCap_kW / 1e3 : null
	};
}

// Backwards compatibility: remove after 2027-04. Results processed before the sizes were introduced.
function _hasAllSizesOutputs(outputs: Partial<SizesOutputs>): outputs is SizesOutputs {
	return _SIZES_OUTPUT_NAMES.every((name) => typeof outputs[name] === 'number');
}
