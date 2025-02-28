<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n/translations';

	import { createDefaultParameters } from './create';

	import { type Phase } from './parameters/phase';

	import Collector from './parameters/collector.svelte';
	import Tes from './parameters/tes/tes.svelte';
	import Demand from './parameters/demand.svelte';
	import SystemDescription from './systemDescription.svelte';

	let parameters = createDefaultParameters();

	let activeParametersTab: 'collector' | 'storage' | 'demand' = 'collector';
	let projectPhase: Phase = 'pre-design';
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
					<Tab bind:group={activeParametersTab} name="collector" value={'collector'}
						>{$t('common.collector')}</Tab
					>
					<Tab bind:group={activeParametersTab} name="storage" value={'storage'}
						>{$t('common.storage')}</Tab
					>
					<Tab bind:group={activeParametersTab} name="demand" value={'demand'}
						>{$t('common.demand')}</Tab
					>

					<svelte:fragment slot="panel">
						<div class="ltr:ml-[1%] rtl:mr-[1%]">
							{#if activeParametersTab === 'collector'}
								<Collector {projectPhase} parameters={parameters.collector_field}/>

							{:else if activeParametersTab === 'storage'}
								<Tes parameters={parameters.storage} {projectPhase}/>
							{:else if activeParametersTab === 'demand'}
								<Demand parameters={parameters.demand}/>
							{/if}
						</div>
					</svelte:fragment>
				</TabGroup>
			</div>
			<div class="flex flex-col mt-2 gap-y-1 ml-auto">
				<button type="button" class="btn variant-filled-primary"
					>{$t('common.downloadPytrnsysProject')}</button
				>
				<button type="button" class="btn variant-filled-primary">{$t('common.runSimulation')}</button>
			</div>
		</div>
	</div>
	<SystemDescription />
</div>

<style>
    * { 
		--input-grid-cols: 30% 70%; 
		--input-unit-grid-cols: 82% 18%;
		--input-button-grid-cols: 45% 55%;
		--input-gap-y: 0.25rem;
	}
</style>
