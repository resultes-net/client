<script lang="ts">
	import { type PopupSettings, Tab, TabGroup, popup } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';

	import TextWithWarning from '$lib/components/textWithWarning.svelte';
	import { t } from '$lib/i18n/translations';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	import { createDefaultParameters } from './create';

	import { type Phase } from './parameters/phase';

	import type { ParametersInput } from 'src/lib/openapi/generated/model/parametersInput';
	import Collector from './parameters/collector.svelte';
	import Demand from './parameters/demand.svelte';
	import Tes from './parameters/tes/tes.svelte';
	import SystemDescription from './systemDescription.svelte';

	let parameters = createDefaultParameters();

	type ActiveParamtersTab = 'collector' | 'storage' | 'demand';
	let activeParametersTab: ActiveParamtersTab = 'collector';
	let projectPhase: Phase = 'pre-design';

	let areParametersValid = {
		collector: true,
		storage: true,
		demand: true,

		all(): boolean {
			return this.collector && this.storage && this.demand;
		}
	};
	let areAllParametersValid;
	$: areAllParametersValid = areParametersValid.all();

	function onAreParametersValidChanged(
		areValid: boolean,
		activeParametersTab: ActiveParamtersTab
	): void {
		areParametersValid[activeParametersTab] = areValid;
	}

	const submitButtonDisabledMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'submitButtonDisabledMessagePopup',
		placement: 'top'
	};

	async function onSubmitButtonClicked(): Promise<void> {
		if (!auth.getIsAuthenticated()) {
			goto('/login');
		}

		const bearerToken = auth.getAccessToken();

		const parametersWrapper: ParametersInput = { values: parameters };

		await getJson({
			endPoint: '/simulations',
			body: JSON.stringify(parametersWrapper),
			bearerToken
		});
	}
</script>

<div class="flex gap-[2%] ltr:mr-[2%] rtl:ml-[2%]">
	<!-- Parameters input section -->
	<div class="basis-1/2">
		<div class="flex flex-col gap-4">
			<h5 class="h5">{$t('common.newSimulation')}</h5>

			<hr class="!border-t-2" />

			<div class="grid grid-cols-[--input-grid-cols] items-center">
				<label for="project-name">{$t('common.projectName')}</label>
				<input class="input" id="project-name" title={$t('common.projectName')} type="text" />
			</div>

			<div class="flex pt-8">
				<h5 class="h5 self-center">{$t('common.parameters')}</h5>
				<select class="select w-auto ml-auto" bind:value={projectPhase}>
					<option value="" disabled selected>{$t('common.projectPhase')}</option>
					<option value="preDesign">{$t('common.preDesignPhase')}</option>
					<option value="design">{$t('common.designPhase')}</option>
				</select>
			</div>

			<hr class="!border-t-2" />

			<div class="flex flex-col">
				<TabGroup>
					<Tab bind:group={activeParametersTab} name="collector" value="collector">
						<TextWithWarning
							text={$t('common.collector')}
							config={{ shallWarn: !areParametersValid.collector, errorMessage: null }}
						/>
					</Tab>
					<Tab bind:group={activeParametersTab} name="storage" value="storage">
						<TextWithWarning
							text={$t('common.storage')}
							config={{ shallWarn: !areParametersValid.storage, errorMessage: null }}
						/>
					</Tab>
					<Tab bind:group={activeParametersTab} name="demand" value="demand">
						<TextWithWarning
							text={$t('common.demand')}
							config={{ shallWarn: !areParametersValid.demand, errorMessage: null }}
						/>
					</Tab>

					<svelte:fragment slot="panel">
						<div class="ltr:ml-[1%] rtl:mr-[1%]">
							{#if activeParametersTab === 'collector'}
								<Collector
									{projectPhase}
									parameters={parameters.collector_field}
									onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'collector')}
								/>
							{:else if activeParametersTab === 'storage'}
								<Tes
									parameters={parameters.storage}
									{projectPhase}
									onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'storage')}
								/>
							{:else if activeParametersTab === 'demand'}
								<Demand
									parameters={parameters.demand}
									onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'demand')}
								/>
							{/if}
						</div>
					</svelte:fragment>
				</TabGroup>
			</div>
			<div class="flex flex-col mt-2 gap-y-1 ml-auto">
				<button type="button" class="btn variant-filled-primary"
					>{$t('common.downloadPytrnsysProject')}</button
				>
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
	<SystemDescription />
</div>

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
