<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info, Folder } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { type Demand } from '$lib/openapi/generated/model/demand';

	import type { OnAreParametersValidChanged } from './onAreParametersValidChanged';

	export let parameters: Demand;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	const profileInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'profileInfoHoverPopup',
		placement: 'top'
	};

	function onDemandProfileChanged(e: Event): void {
		const inputElement = e.target as HTMLInputElement;

		const file = inputElement?.files?.[0];

		if (file == null) {
			return;
		}

		parameters.profile = {
			profile_type: 'user-provided',
			data: file
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
		<label>
			<span class="btn variant-filled-primary"><Folder /></span>
			<input id="demand-profile" type="file" hidden on:change={onDemandProfileChanged} />
		</label>
		<label for="demand-profile">
			{parameters.name}
			<button
				class="btn variant-filled-primary [&>*]:pointer-events-none"
				use:popup={profileInfoHoverPopupSettings}
			>
				<Info />
			</button>
		</label>
	</div>
</div>
