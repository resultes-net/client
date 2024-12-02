<script lang="ts">
	import { AccordionItem } from "@skeletonlabs/skeleton";

    export let isOpened: boolean = false;
</script>

<AccordionItem {...$$restProps} open={isOpened} on:toggle={() => isOpened = !isOpened}>
    <svelte:fragment slot="summary"><slot name="summary"/></svelte:fragment>
    <svelte:fragment slot="content"><slot name="content"/></svelte:fragment>
</AccordionItem>