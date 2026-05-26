<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info, Folder } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { type Demand } from '$lib/openapi/generated/model/demand';

	import type { OnAreParametersValidChanged } from './onAreParametersValidChanged';

	export let parameters: Demand;
	export let onShowProfileDetails;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;
	const profileInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'profileInfoHoverPopup',
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

		parameters.profile = {
			profile_type: 'user-provided',
			hourly_heat_demand_MW
		};
	}
</script>

<div data-popup="profileInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>
			A CSV file giving for each time step the time, mass flow rate in kg/h and the temperature in
			°C required.
		</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="grid grid-cols-[--input-grid-cols] gap-y-[--input-gap-y]">
	<p>{$t('common.demandProfile')}</p>
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
		{#if parameters.profile.profile_type === 'predefined'}
			<label for="demand-profile">
				{parameters.profile.name}
			</label>
		{:else}
			<button class="btn" on:click={onShowProfileDetails}>Custom...</button>
		{/if}
		<button
			class="btn variant-filled-primary [&>*]:pointer-events-none"
			use:popup={profileInfoHoverPopupSettings}
		>
			<Info />
		</button>
	</div>
</div>
