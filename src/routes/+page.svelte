<script lang="ts">
	import { ChevronRight, House } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import Logos from './Logos.svelte';
</script>

<div class="flex flex-row mt-8">
	<nav class="list-nav flex flex-col">
		<ul>
			<li>
				<a href="/" class="justify-center">
					<span class="badge"><House /></span>
				</a>
			</li>
			<li>
				<a href="/simulations/new">
					<span class="badge"><ChevronRight /></span>
					<span>{$t('common.newSimulation')}</span>
				</a>
			</li>
			<li>
				<a href="/simulations/">
					<span class="badge"><ChevronRight /></span>
					<span>{$t('common.savedSimulations')}</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="ml-[15rem]">
		<Logos />
	</div>
</div>
