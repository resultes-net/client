<script lang="ts">
	import { t } from '$lib/i18n/translations';

	import ptesDiagram from '$lib/assets/PTES_diagram.svg';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
</script>

<div class="space-y-5 basis-1/2">
	<div class="flex flex-col gap-4">
		<h5 class="h5">{$t('common.systemDiagram')}</h5>
		<hr class="!border-t-2" />
		<div class="ltr:ml-[1%] rtl:mr-[1%]">
			<img class="bg-white" src={ptesDiagram} alt={$t('common.systemDiagram')} />
			<Accordion class="mt-2">
				<AccordionItem>
					<svelte:fragment slot="summary">
						<h6 class="h6">Details</h6>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<div />
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</div>
