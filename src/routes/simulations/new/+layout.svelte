<script lang="ts">
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';

	import { ArrowBigLeft, ChevronRight } from 'lucide-svelte';

	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';

	function computeLastPart(): string {
		const parts = $page.url.pathname.split('/');

		if (parts.length === 0) {
			return '';
		}

		const lastPart = parts[parts.length - 1];

		return lastPart;
	}

	$: lastPart = computeLastPart();

	$: classesActive = (href: string) => (href == lastPart ? '!variant-filled-primary' : '');
</script>

<div class="flex flex-row mt-[2%]">
	<nav class="list-nav">
		<ul>
			<li>
				<a href="/" class="justify-center">
					<span class="badge"><ArrowBigLeft /></span>
				</a>
			</li>
			<li>
				<a href="ttes" class="{classesActive('ttes')}">
					<span class="badge"><ChevronRight /></span>
					<span>TTES</span>
				</a>
			</li>
			<li>
				<a href="ptes" class={classesActive('ptes')}>
					<span class="badge"><ChevronRight /></span>
					<span>PTES</span>
				</a>
			</li>
			<li>
				<a href="btes" class={classesActive('btes')}>
					<span class="badge"><ChevronRight /></span>
					<span>BTES</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="flex-grow ltr:ml-[2%] rtl:mr-[2%]">
		<main>
			<slot />
		</main>
	</div>
</div>
