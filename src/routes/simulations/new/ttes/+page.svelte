<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info, Folder } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { createDefaultParameters } from './create';

	import { type Phase } from './parameters/phase';

	import Collector from './parameters/collector.svelte'
	import Tes from './parameters/tes/tes.svelte'

	import ttesDiagram from '$lib/assets/TTES_diagram.svg';

	let parameters = createDefaultParameters();

	let activeParametersTab: 'collector' | 'storage' | 'demand' = 'collector';
	let projectPhase: Phase = 'pre-design';

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

<div class="flex gap-[2%] ltr:mr-[2%] rtl:ml-[2%]">
	<!-- Parameters input section -->
	<div class="basis-1/2">
		<div class="flex flex-col gap-4">
			<h5 class="h5">{$t('common.newSimulation')}</h5>
			
			<hr class="!border-t-2" />
			
			<div class="grid grid-cols-[30%_70%] items-center">
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
								<Tes parameters={parameters.storage}/>
							{:else if activeParametersTab === 'demand'}
								<div class="grid grid-cols-[30%_70%] items-center gap-y-1">
									<div class="flex flex-col gap-2">
										<p>{$t('common.demandProfile')}</p>
										<div
											class="input-group input-group-divider grid grid-cols-[auto_1fr_auto] items-center gap-2"
										>
											<label>
												<span class="btn variant-filled"><Folder /></span>
												<input
													id="demand-profile"
													type="file"
													hidden
													on:change={onDemandProfileChanged}
												/>
											</label>
											<label for="demand-profile"
												>{parameters.demand.profile.profile_type == 'predefined'
													? parameters.demand.profile.name
													: '<User provided>'}</label
											>
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
												A CSV file giving for each time step the time, mass flow rate in kg/h and
												the temperature in °C required.
											</p>
											<div class="arrow variant-filled-secondary" />
										</div>
									</div>
								</div>
							{/if}
						</div>
					</svelte:fragment>
				</TabGroup>
			</div>
			<div class="flex flex-col mt-2 gap-1 ml-auto">
				<button type="button" class="btn variant-filled"
					>{$t('common.downloadPytrnsysProject')}</button
				>
				<button type="button" class="btn variant-filled">{$t('common.runSimulation')}</button>
			</div>
		</div>
	</div>

	<!-- RHS: currently diagram plus description -->
	<div class="space-y-5 basis-1/2">
		<div class="flex flex-col gap-4">
			<h5 class="h5">{$t('common.systemDiagram')}</h5>
			<hr class="!border-t-2" />
			<div class="ltr:ml-[1%] rtl:mr-[1%]">
				<img class="bg-white" src={ttesDiagram} alt={$t('ttes.diagram')} />
				<ol class="list mt-4 max-h-[300px] overflow-auto items-start">
					<li>
						<span class="self-start">1)</span>
						<span class="flex-auto">
							a heat sink: the demand. Note the small pipe icon embedded into the sink’s icon. This
							is the network side pump.
						</span>
					</li>
					<li>
						<span class="self-start">2)</span>
						<span class="flex-auto">
							a “double pipe”, two parallel pipes, one for the hot supply and one for the cold
							return, insulated against each other and against the ground. This pipe models the DH
							network. It includes a model of the soil surrounding the two pipes to account for
							gains from, and losses to, the ground.
						</span>
					</li>
					<li>
						<span class="self-start">3)</span>
						<span class="flex-auto">
							A valve for mixing the supply with the return. It used to ensure that the supply
							temperature does not get too high. The valve can assume any position between 0 and 1,
							inclusive. The positions 0 and 1 are indicated in the figure.
						</span>
					</li>
					<li>
						<span class="self-start">4)</span>
						<span class="flex-auto">
							A “gas boiler”. There isn’t any proper model behind this component. It simply sets the
							supply tem- perature to at least the set point supply temperature and records the
							energy required to do that. The energy needed by this component represents the energy
							that could not be provided by either source 11) or 12) (see below)
						</span>
					</li>
					<li>
						<span class="self-start">5)</span>
						<span class="flex-auto">
							A by-passing valve. Its position is either 0 or 1. The valve switches to 1 if the
							return temperature of the network is above the temperature of the mass flow at the “0”
							outlet of 6)
						</span>
					</li>
					<li>
						<span class="self-start">6)</span>
						<span class="flex-auto">
							A stratifying valve (can be at 0 or 1) for switching between the storage inlets at 8)
							and 9) when charging the storage. The valve position will be chosen such that the
							temperature at the storage inlet is closer to the supply temperature going into the
							valve.
						</span>
					</li>
					<li>
						<span class="self-start">7)</span>
						<span class="flex-auto">The TES tank </span>
					</li>
					<li>
						<span class="self-start">8)</span>
						<span>
							The tank inlet for charging with high temperatures / The tank outlet for discharging.
						</span>
					</li>
					<li>
						<span class="self-start">9)</span>
						<span class="flex-auto"> The tank inlet for charging with lower temperatures. </span>
					</li>
					<li>
						<span class="self-start">10)</span>
						<span class="flex-auto">
							The cold tank inlet/outlet. Due to technical limitations of the simulation framework,
							storage ports must come in pairs. In reality, only one port would be needed instead of
							the two used at 10). Therefore, there immediately combined using the T-piece.
						</span>
					</li>
					<li>
						<span class="self-start">11)</span>
						<span class="flex-auto">The solar thermal collector field heat source</span>
					</li>
					<li><span>12)</span> <span>The user-defined heat source</span></li>
					<li>
						<span>13)</span><span>The pump for the primary loop of the solar thermal system</span>
					</li>
					<li>
						<span>14)</span>
						<span>The pump for the secondary loop of the solar thermal system</span>
					</li>
					<li>
						<span>15)</span>
						<span>
							The pump for the secondary loop of the user-defined source (the pump for the primary
							loop is “built into” the source as is indicated by the small pump inside the source’s
							icon)
						</span>
					</li>
				</ol>
			</div>
		</div>
	</div>
</div>
