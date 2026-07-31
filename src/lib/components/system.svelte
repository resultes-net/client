<script lang="ts" context="module">
	export interface Exports {
		projectPhase: Phase;
		yearlyHeatDemandGWh: number;
		collectorFieldAreaM2: number;
		collectorIsShowIam: boolean;
		onAreParametersValidChanged(areValid: boolean, activeParametersTab: ActiveParamtersTab): void;
	}

	export type ActiveParamtersTab =
		| 'demand'
		| 'collector'
		| 'wasteHeatRecovery'
		| 'storage'
		| 'control';
</script>

<script lang="ts">
	import { type PopupSettings, Tab, TabGroup, popup } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';

	import { Location } from 'src/lib/openapi/generated/model/location';

	import TextWithWarning from '$lib/components/textWithWarning.svelte';
	import { t } from '$lib/i18n/translations';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	import { type Phase } from 'src/lib/components/parameters/phase';

	import Collector from 'src/lib/components/parameters/collector.svelte';
	import Demand from 'src/lib/components/parameters/demand.svelte';
	import { default as CollectorProfile } from 'src/lib/components/parameters/demand/profile.svelte';
	import WasteHeatRecoverySource from 'src/lib/components/parameters/wasteHeatRecoverySource.svelte';
	import { default as WhrSourceProfile } from 'src/lib/components/parameters/wasteHeatRecoverySource/profile.svelte';
	import type { CreateSimulation } from 'src/lib/openapi/generated/model/createSimulation';
	import type { Type } from '../openapi/generated/model/type';
	import type { Values } from '../openapi/generated/model/values';

	export let systemType: Type;

	export let parameters;
	const simulation: CreateSimulation = {
		name: '',
		location: Location.Zurich,
		type: systemType,
		parameters: { values: parameters }
	};

	let activeParametersTab: ActiveParamtersTab = 'demand';
	let projectPhase: Phase = 'pre-design';

	let yearlyHeatDemandGWh: number;

	const areParametersValid = {
		demand: true,
		collector: true,
		wasteHeatRecovery: true,
		storage: true,
		control: true,

		all(): boolean {
			return (
				this.demand && this.collector && this.wasteHeatRecovery && this.storage && this.control
			);
		}
	};
	let areAllParametersValid: boolean;
	$: areAllParametersValid = areParametersValid.all();

	let collectorIsShowIam = false;

	let collectorFieldAreaM2: number;
	$: {
		const area = parameters.collector_field.area;
		if (area.scaling === 'absolute_m2') {
			collectorFieldAreaM2 = area.value;
		} else if (area.scaling === 'relative_to_demand_m2_per_MWh') {
			const yearlyHeatDemandMWh = yearlyHeatDemandGWh * 1000;
			collectorFieldAreaM2 = area.value * yearlyHeatDemandMWh;
		} else {
			throw new Error(`Unknown area scaling: '${area.scaling}'.`);
		}
	}

	function onAreParametersValidChanged(
		areValid: boolean,
		activeParametersTab: ActiveParamtersTab
	): void {
		areParametersValid[activeParametersTab] = areValid;
	}

	export let exports: Exports;
	$: {
		exports = {
			parameters,
			projectPhase,
			yearlyHeatDemandGWh,
			collectorFieldAreaM2,
			collectorIsShowIam,
			onAreParametersValidChanged
		};
	}

	const submitButtonDisabledMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'submitButtonDisabledMessagePopup',
		placement: 'top'
	};

	async function onSubmitButtonClicked() {
		const token = auth.getTokenOrNull();

		if (token === null) {
			goto('/login');
			return;
		}

		await getJson({
			endPoint: '/simulations',
			body: JSON.stringify(simulation),
			bearerToken: token.token
		});

		goto(`/simulations`);
	}

	let isShowCollectorProfileDetails = false;

	function onShowCollectorProfileDetails() {
		isShowCollectorProfileDetails = true;
	}

	function onHideCollectorProfileDetails() {
		isShowCollectorProfileDetails = false;
	}

	let isShowWhrSourceProfileDetails = false;

	function onShowWhrSourceProfileDetails() {
		isShowWhrSourceProfileDetails = true;
	}

	function onHideWhrSourceProfileDetails() {
		isShowWhrSourceProfileDetails = false;
	}
</script>

{#if isShowCollectorProfileDetails}
	<div class="flex flex-col gap-4">
		<button on:click={onHideCollectorProfileDetails} class="anchor mr-auto text-sm"
			>← {$t('common.GoBack')}</button
		>
		<h5 class="h5">Demand profile properties</h5>
		<CollectorProfile bind:demand={parameters.demand} />
	</div>
{:else if isShowWhrSourceProfileDetails}
	<div class="flex flex-col gap-4">
		<button on:click={onHideWhrSourceProfileDetails} class="anchor mr-auto text-sm"
			>← {$t('common.GoBack')}</button
		>
		<h5 class="h5">Demand profile properties</h5>
		<WhrSourceProfile bind:whrSource={parameters.waste_heat_recovery_source} />
	</div>
{:else}
	<div class="flex flex-row gap-[2%] ltr:mr-[2%] rtl:ml-[2%]">
		<!-- Parameters input section -->
		<div class="basis-1/2">
			<div class="flex flex-col gap-4">
				<h5 class="h5">{$t('common.newSimulation')}</h5>

				<hr class="!border-t-2" />

				<div class="grid grid-cols-[--input-grid-cols] items-center">
					<label for="project-name">{$t('common.projectName')}</label>
					<input
						class="input"
						id="project-name"
						title={$t('common.projectName')}
						type="text"
						bind:value={simulation.name}
					/>
				</div>

				<div class="grid grid-cols-[--input-grid-cols] items-center">
					<label for="location">{$t('common.Location')}</label>
					<select class="select" bind:value={simulation.location}>
						<option value="Berlin">{$t('common.Berlin')}</option>
						<option value="Brussels">{$t('common.Brussels')}</option>
						<option value="Copenhagen">{$t('common.Copenhagen')}</option>
						<option value="Madrid">{$t('common.Madrid')}</option>
						<option value="Zurich">{$t('common.Zurich')}</option>
					</select>
				</div>

				<div class="flex pt-8">
					<h5 class="h5 self-center">{$t('common.parameters')}</h5>
					<select class="select w-auto ml-auto" bind:value={projectPhase}>
						<option value="pre-design">{$t('common.preDesignPhase')}</option>
						<option value="design">{$t('common.designPhase')}</option>
					</select>
				</div>

				<hr class="!border-t-2" />

				<div class="flex flex-col">
					<TabGroup>
						<Tab bind:group={activeParametersTab} name="demand" value="demand">
							<TextWithWarning
								text={$t('common.demand')}
								config={{ shallWarn: !areParametersValid.demand, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="collector" value="collector">
							<TextWithWarning
								text={$t('common.collector')}
								config={{ shallWarn: !areParametersValid.collector, errorMessage: null }}
							/>
						</Tab>
						<Tab
							bind:group={activeParametersTab}
							name="wasteHeatRecovery"
							value="wasteHeatRecovery"
						>
							<TextWithWarning
								text={$t('common.WasteHeatRecoverySource')}
								config={{ shallWarn: !areParametersValid.collector, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="storage" value="storage">
							<TextWithWarning
								text={$t('common.storage')}
								config={{ shallWarn: !areParametersValid.demand, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="control" value="control">
							<TextWithWarning
								text={$t('common.Control')}
								config={{ shallWarn: !areParametersValid.control, errorMessage: null }}
							/>
						</Tab>

						<svelte:fragment slot="panel">
							<div class="ltr:ml-[1%] rtl:mr-[1%]">
								{#if activeParametersTab === 'demand'}
									<Demand
										bind:parameters={parameters.demand}
										onShowProfileDetails={onShowCollectorProfileDetails}
										bind:yearlyHeatDemandGWh
										onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'demand')}
									/>
								{:else if activeParametersTab === 'collector'}
									<Collector
										{projectPhase}
										bind:parameters={parameters.collector_field}
										{yearlyHeatDemandGWh}
										onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'collector')}
										bind:isShowIam={collectorIsShowIam}
									/>
								{:else if activeParametersTab === 'wasteHeatRecovery'}
									<WasteHeatRecoverySource
										bind:parameters={parameters.waste_heat_recovery_source}
										onAreParametersValidChanged={(v) =>
											onAreParametersValidChanged(v, 'wasteHeatRecovery')}
										onShowProfileDetails={onShowWhrSourceProfileDetails}
									/>
								{:else if activeParametersTab === 'storage'}
									<slot name="storage">ERROR: no storage slot provided.</slot>
								{:else if activeParametersTab === 'control'}
									<slot name="control">ERROR: no control slot provided.</slot>
								{:else}
									ERROR: Unknown tab `{activeParametersTab}`.
								{/if}
							</div>
						</svelte:fragment>
					</TabGroup>
				</div>
				<div class="flex flex-col mt-2 gap-y-1 ml-auto">
					<button type="button" class="btn variant-filled-primary">
						{$t('common.downloadPytrnsysProject')}
					</button>
					<button
						type="button"
						class="btn variant-filled-primary [&>*]:pointer-events-none"
						use:popup={submitButtonDisabledMessagePopupSettings}
						disabled={!areAllParametersValid}
						on:click={onSubmitButtonClicked}
						>{$t('common.runSimulation')}
					</button>
				</div>
			</div>
		</div>
		<slot name="systemDescription">ERROR: No system description slot specified.</slot>
	</div>
{/if}

<div data-popup="submitButtonDisabledMessagePopup">
	<div hidden={areAllParametersValid} class="card p-4 variant-filled-warning z-50">
		<p>{$t('common.correctErrorsInParameters')}</p>
		<div class="arrow variant-filled-warning" />
	</div>
</div>

<style>
	* {
		--input-grid-cols: 30% 70%;
		--input-unit-grid-cols: 82% 18%;
		--input-button-grid-cols: 45% 55%;
		--input-gap-y: 0.25rem;
	}
</style>
