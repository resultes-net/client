<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Folder, Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { createDefaultWasteHeatRecoverySource } from 'src/lib/createDefaultWasteHeatRecoverySource';
	import type { WasteHeatRecoverySource } from 'src/lib/openapi/generated/model/wasteHeatRecoverySource';
	import type { OnAreParametersValidChanged } from './onAreParametersValidChanged';

	export let parameters: WasteHeatRecoverySource;
	export let onShowProfileDetails;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	const HOURS_IN_A_YEAR = 365 * 24;

	const profileInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'profileInfoHoverPopup',
		placement: 'top'
	};

	async function onProfileChanged(e: Event): Promise<void> {
		const inputElement = e.target as HTMLInputElement;

		const file = inputElement?.files?.[0];

		if (file == null) {
			return;
		}

		// TODO: deal with reading and parsing errors
		const text = await file.text();
		const rows: [number, number][] = text
			.split('\n')
			.slice(1)
			.filter((s) => s.trim())
			.map((l) => l.split(/\s+/))
			.map(([m, t]) => [Number(m.trim()), Number(t.trim())]);

		if (rows.length !== HOURS_IN_A_YEAR) {
			throw new Error(
				`Waste heat recovery profile must contain exactly ${HOURS_IN_A_YEAR} lines, but got ${rows.length}.`
			);
		}

		const massFlowRates = rows.map(([m]) => m);
		const temperatures = rows.map(([, t]) => t);

		parameters = {
			name: file.name,
			mass_flow_rates_kg_per_h: massFlowRates,
			temperatures_deg_C: temperatures
		};
	}

	function resetProfile() {
		parameters = createDefaultWasteHeatRecoverySource();
	}
</script>

<div data-popup="profileInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p class="mb-2">
			A CSV file with one header row and two columns, giving - for each hour of the year - the mass
			flow rate in kg/h and the the temperature in °C. Therefore, the file will contain 8760+1 lines
			like this:
		</p>
		<pre>Mass flow rate [kg/h]	Temperature [C]
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
100 35
...</pre>
		<p>
			In this example the waste heat recovery source would provide 35 °C at 100 kg/h throughout the
			year.
		</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
	<p>{$t('common.WasteHeatSupplyProfile')}</p>
	<div class="flex flex-col mb-2">
		<div class="input-group input-group-divider grid grid-cols-[auto_1fr_auto] items-center gap-2">
			<label class="label">
				<span class="btn variant-filled-primary"><Folder /></span>
				<input
					id="demand-profile"
					type="file"
					hidden
					aria-label={$t('common.WasteHeatSupplyProfile')}
					on:change={onProfileChanged}
				/>
			</label>
			<button class="anchor" on:click={onShowProfileDetails}>{parameters.name}</button>
			<button
				class="btn variant-filled-primary [&>*]:pointer-events-none"
				use:popup={profileInfoHoverPopupSettings}
			>
				<Info />
			</button>
		</div>
		<button type="button" class="anchor self-end text-xs" on:click={resetProfile}
			>{$t('common.reset')}</button
		>
	</div>
</div>
