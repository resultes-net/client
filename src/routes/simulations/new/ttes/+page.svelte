<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info, Folder } from 'lucide-svelte';

	import AccordionItem from '$lib/components/statefulAccordionItem.svelte';
	import Range from '$lib/components/range.svelte';
	import { t } from '$lib/i18n/translations';

	import { createDefaultParameters, type FileWithPath } from './params';

	let parameters = createDefaultParameters();

	let activeTab: 'collector' | 'storage' | 'demand' = 'collector';

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

		parameters.demand.profile = file;
	}
</script>

<div class="space-y-5 w-1/3">
	<TabGroup>
		<Tab bind:group={activeTab} name="collector" value={'collector'}>{$t('common.collector')}</Tab>
		<Tab bind:group={activeTab} name="storage" value={'storage'}>{$t('common.storage')}</Tab>
		<Tab bind:group={activeTab} name="demand" value={'demand'}>{$t('common.demand')}</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<div class="ltr:ml-[1%] rtl:mr-[1%]">
				{#if activeTab === 'collector'}
					<div class="grid grid-cols-[30%_70%] items-center">
						<label for="collector-area">{$t('common.collectorArea')}</label>
						<div class="input-group input-group-divider grid grid-cols-[85%_15%]">
							<input
								class="input"
								id="collector-area"
								title={$t('common.collectorArea')}
								type="number"
							/>
							<div>m<sup>2</sup></div>
						</div>
					</div>
				{:else if activeTab === 'storage'}
					<div class="grid grid-cols-[30%_70%] items-center">
						<label for="storage-volume">{$t('common.storageVolume')}</label>
						<div class="input-group input-group-divider grid grid-cols-[85%_15%]">
							<input
								class="input"
								id="storage-volume"
								title={$t('common.storageVolume')}
								type="number"
							/>
							<div>m<sup>3</sup></div>
						</div>
					</div>
				{:else if activeTab === 'demand'}
					<div class="flex flex-col gap-2">
						<p>{$t('common.demandProfile')}</p>
						<div
							class="input-group input-group-divider grid grid-cols-[auto_1fr_auto] items-center gap-2"
						>
							<label>
								<span class="btn variant-filled"><Folder /></span>
								<input id="demand-profile" type="file" hidden on:change={onDemandProfileChanged} />
							</label>
							<label for="demand-profile">{parameters.demand.profile?.name || ''}</label>
							<button
								class="btn variant-filled [&>*]:pointer-events-none"
								use:popup={profileInfoHoverPopupSettings}
							>
								<Info />
							</button>
						</div>
					</div>
					<div data-popup="profileInfoHoverPopup">
						<div class="card p-4 variant-filled-secondary z-50">
							<p>
								A CSV file giving for each time step the time, mass flow rate in kg/h and the
								temperature in °C required.
							</p>
							<div class="arrow variant-filled-secondary" />
						</div>
					</div>
				{/if}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>
