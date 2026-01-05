<script lang="ts">
	import { t } from '$lib/i18n/translations';

	import ttesDiagram from '$lib/assets/PTES_diagram.svg';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<div class="space-y-5 basis-1/2">
	<div class="flex flex-col gap-4">
		<h5 class="h5">{$t('common.systemDiagram')}</h5>
		<hr class="!border-t-2" />
		<div class="ltr:ml-[1%] rtl:mr-[1%]">
			<img class="bg-white" src={ttesDiagram} alt={$t('ttes.diagram')} />
			<Accordion class="mt-2">
				<AccordionItem>
					<svelte:fragment slot="summary">
						<h6 class="h6">Details</h6>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<ol class="list mt-4 max-h-[300px] overflow-auto items-start">
							<li>
								<span class="self-start">1)</span>
								<span class="flex-auto">
									a heat sink: the demand. Note the small pipe icon embedded into the sink’s icon.
									This is the network side pump.
								</span>
							</li>
							<li>
								<span class="self-start">2)</span>
								<span class="flex-auto">
									a “double pipe”, two parallel pipes, one for the hot supply and one for the cold
									return, insulated against each other and against the ground. This pipe models the
									DH network. It includes a model of the soil surrounding the two pipes to account
									for gains from, and losses to, the ground.
								</span>
							</li>
							<li>
								<span class="self-start">3)</span>
								<span class="flex-auto">
									A valve for mixing the supply with the return. It used to ensure that the supply
									temperature does not get too high. The valve can assume any position between 0 and
									1, inclusive. The positions 0 and 1 are indicated in the figure.
								</span>
							</li>
							<li>
								<span class="self-start">4)</span>
								<span class="flex-auto">
									A “gas boiler”. There isn’t any proper model behind this component. It simply sets
									the supply tem- perature to at least the set point supply temperature and records
									the energy required to do that. The energy needed by this component represents the
									energy that could not be provided by either source 11) or 12) (see below)
								</span>
							</li>
							<li>
								<span class="self-start">5)</span>
								<span class="flex-auto">
									A by-passing valve. Its position is either 0 or 1. The valve switches to 1 if the
									return temperature of the network is above the temperature of the mass flow at the
									“0” outlet of 6)
								</span>
							</li>
							<li>
								<span class="self-start">6)</span>
								<span class="flex-auto">
									A stratifying valve (can be at 0 or 1) for switching between the storage inlets at
									8) and 9) when charging the storage. The valve position will be chosen such that
									the temperature at the storage inlet is closer to the supply temperature going
									into the valve.
								</span>
							</li>
							<li>
								<span class="self-start">7)</span>
								<span class="flex-auto">The TES tank </span>
							</li>
							<li>
								<span class="self-start">8)</span>
								<span>
									The tank inlet for charging with high temperatures / The tank outlet for
									discharging.
								</span>
							</li>
							<li>
								<span class="self-start">9)</span>
								<span class="flex-auto">
									The tank inlet for charging with lower temperatures.
								</span>
							</li>
							<li>
								<span class="self-start">10)</span>
								<span class="flex-auto">
									The cold tank inlet/outlet. Due to technical limitations of the simulation
									framework, storage ports must come in pairs. In reality, only one port would be
									needed instead of the two used at 10). Therefore, there immediately combined using
									the T-piece.
								</span>
							</li>
							<li>
								<span class="self-start">11)</span>
								<span class="flex-auto">The solar thermal collector field heat source</span>
							</li>
							<li><span>12)</span> <span>The user-defined heat source</span></li>
							<li>
								<span>13)</span><span
									>The pump for the primary loop of the solar thermal system</span
								>
							</li>
							<li>
								<span>14)</span>
								<span>The pump for the secondary loop of the solar thermal system</span>
							</li>
							<li>
								<span>15)</span>
								<span>
									The pump for the secondary loop of the user-defined source (the pump for the
									primary loop is “built into” the source as is indicated by the small pump inside
									the source’s icon)
								</span>
							</li>
						</ol>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</div>
