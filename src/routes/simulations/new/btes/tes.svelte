<script lang="ts">
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';
	import type { Phase } from '$lib/components/parameters/phase';
	import type { BtesStorage } from 'src/lib/openapi/generated/model/btesStorage';
	import NBoreholes from './tes/NBoreholes.svelte';
	import { t } from 'src/lib/i18n/translations';

	export let projectPhase: Phase;
	export let parameters: BtesStorage;
	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<NBoreholes
	parameters={parameters.n_boreholes}
	{yearlyHeatDemandGWh}
	{collectorFieldAreaM2}
	{onAreParametersValidChanged}
/>
{#if projectPhase == 'design'}
	<div class="m-2 p-2">
		<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
			<label for="spacing">{$t('btes.BoreholeSpacing')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="spacing"
					title={$t('btes.BoreholeSpacing')}
					type="number"
					bind:value={parameters.borehole_spacing_m}
					min="0"
				/>
				<div><span class="flex flex-grow justify-center">m</span></div>
			</div>

			<label for="demand-delta-t">{$t('btes.BoreholeDepth')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="demand-delta-t"
					title={$t('btes.BoreholeDepth')}
					type="number"
					value={parameters.borehole_depth_m}
					min="0"
				/>
				<div><span class="flex flex-grow justify-center">m</span></div>
			</div>
		</div>
	</div>
{/if}
