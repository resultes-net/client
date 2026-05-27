<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Folder, Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { type Demand } from '$lib/openapi/generated/model/demand';

	import { createDefaultDemand } from 'src/lib/createDefaultDemand';
	import type { OnAreParametersValidChanged } from './onAreParametersValidChanged';

	export let parameters: Demand;
	export let onShowProfileDetails;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;
	const profileInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'profileInfoHoverPopup',
		placement: 'top'
	};

	const scalingFactorInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'scalingFactorInfoHoverPopup',
		placement: 'top'
	};

	async function onDemandProfileChanged(e: Event): Promise<void> {
		const inputElement = e.target as HTMLInputElement;

		const file = inputElement?.files?.[0];

		if (file == null) {
			return;
		}

		// TODO: deal with reading and parsing errors
		const text = await file.text();
		const hourly_heat_demand_MW = text
			.split('\n')
			.slice(1)
			.filter((s) => s.trim())
			.map(Number);

		const hoursInAYear = 365 * 24;

		if (hourly_heat_demand_MW.length !== hoursInAYear) {
			throw new Error(
				`Demand profile must contain exactly ${hoursInAYear} lines, but got ${hourly_heat_demand_MW.length}.`
			);
		}

		parameters = {
			name: file.name,
			scaling_factor: parameters.scaling_factor,
			hourly_heat_demand_MW
		};
	}

	function resetProfile() {
		const demand = createDefaultDemand();
		demand.scaling_factor = parameters.scaling_factor;
		parameters = demand;
	}

	let unscaledYearlyHeatDemandGwh: number;
	$: unscaledYearlyHeatDemandGwh =
		parameters.hourly_heat_demand_MW.reduce((s, d) => s + d, 0) / 1000;
</script>

<div data-popup="profileInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>
			A CSV file giving for each with one header row and one column giving, for each hour of the
			year, the heat demand in MW.
		</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div data-popup="scalingFactorInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>Every hourly demand will be multiplied by this factor before being applied.</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="grid grid-cols-[--input-grid-cols] gap-y-[--input-gap-y]">
	<p>{$t('common.demandProfile')}</p>
	<div class="flex flex-col mb-2">
		<div class="input-group input-group-divider grid grid-cols-[auto_1fr_auto] items-center gap-2">
			<label class="label">
				<span class="btn variant-filled-primary"><Folder /></span>
				<input
					id="demand-profile"
					type="file"
					hidden
					aria-label={$t('common.demandProfile')}
					on:change={onDemandProfileChanged}
				/>
			</label>
			<button class="btn" on:click={onShowProfileDetails}>{parameters.name}...</button>
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

	<label for="demand-scaling-factor">{$t('common.scalingFactor')}</label>
	<div class="input-group input-group-divider grid grid-cols-[1fr_auto] items-center gap-2">
		<input
			class="input"
			id="demand-scaling-factor"
			title={$t('common.scalingFactor')}
			type="number"
			min="0"
			bind:value={parameters.scaling_factor}
		/>
		<button
			class="btn variant-filled-primary [&>*]:pointer-events-none"
			use:popup={scalingFactorInfoHoverPopupSettings}
		>
			<Info />
		</button>
	</div>

	<label for="yearly-demand">{$t('common.yearlyHeatDemand')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="yearly-demand"
			title={$t('common.yearlyHeatDemand')}
			type="number"
			value={(parameters.scaling_factor * unscaledYearlyHeatDemandGwh).toFixed(1)}
			readonly
		/>
		<div><span class="flex flex-grow justify-center">GWh</span></div>
	</div>
</div>
