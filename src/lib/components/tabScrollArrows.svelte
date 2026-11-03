<!--
	Arrow buttons on either side of a Skeleton `TabGroup`'s tab row, shown while the row can scroll further in their
	direction. Skeleton hides the row's scrollbar, so without them, nothing shows that there are more tabs.

	Put it next to the `TabGroup`, inside a `relative` element that holds both and is passed as `container`, and give
	the `TabGroup` `regionList="mx-5"`: the arrows sit in that margin. It isn't a wrapper around the `TabGroup`, because
	passing the `TabGroup`'s slots on through another component loses updates in Svelte 4: the parameters form didn't
	react to a project phase switch.
-->
<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onDestroy } from 'svelte';

	import { t } from '$lib/i18n/translations';

	export let container: HTMLElement | undefined;

	let tabList: HTMLElement | null = null;
	let canScrollLeft = false;
	let canScrollRight = false;
	let tabListHeight = 0;

	let resizeObserver: ResizeObserver | null = null;
	let mutationObserver: MutationObserver | null = null;

	function update() {
		if (!tabList) return;
		const { scrollLeft, scrollWidth, clientWidth, offsetHeight } = tabList;
		// Tolerate subpixel rounding.
		canScrollLeft = scrollLeft > 1;
		canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;
		tabListHeight = offsetHeight;
	}

	function observeTabs() {
		if (!tabList || !resizeObserver) return;
		resizeObserver.disconnect();
		resizeObserver.observe(tabList);
		// The tabs change width without the row changing size, e.g. on a language switch.
		for (const tab of tabList.children) resizeObserver.observe(tab);
	}

	function scrollByHalf(direction: -1 | 1) {
		tabList?.scrollBy({ left: (direction * tabList.clientWidth) / 2, behavior: 'smooth' });
	}

	function detach() {
		tabList?.removeEventListener('scroll', update);
		resizeObserver?.disconnect();
		mutationObserver?.disconnect();
		tabList = resizeObserver = mutationObserver = null;
	}

	// The container is bound by the parent, so it's only set after the first render.
	function attach(container: HTMLElement | undefined) {
		detach();
		tabList = container?.querySelector<HTMLElement>('.tab-list') ?? null;
		if (!tabList) return;
		tabList.addEventListener('scroll', update, { passive: true });
		resizeObserver = new ResizeObserver(update);
		mutationObserver = new MutationObserver(() => {
			observeTabs();
			update();
		});
		mutationObserver.observe(tabList, { childList: true });
		observeTabs();
		update();
	}

	$: attach(container);

	onDestroy(detach);
</script>

{#if canScrollLeft}
	<button
		type="button"
		class="absolute left-0 top-0 flex w-5 items-center justify-center hover:variant-soft rounded-container-token"
		style="height: {tabListHeight}px"
		aria-label={$t('common.ScrollTabsLeft')}
		on:click={() => scrollByHalf(-1)}
	>
		<ChevronLeft size={16} />
	</button>
{/if}
{#if canScrollRight}
	<button
		type="button"
		class="absolute right-0 top-0 flex w-5 items-center justify-center hover:variant-soft rounded-container-token"
		style="height: {tabListHeight}px"
		aria-label={$t('common.ScrollTabsRight')}
		on:click={() => scrollByHalf(1)}
	>
		<ChevronRight size={16} />
	</button>
{/if}
