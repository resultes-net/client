<script lang="ts">
	import { House, ChevronRight } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
</script>

<div class="flex flex-row mt-[2%]">
	<nav class="list-nav">
		<ul>
			<li>
				<a href="/" class="justify-center">
					<span class="badge"><House /></span>
				</a>
			</li>
			<li>
				<a href="/simulations/new">
					<span class="badge"><ChevronRight /></span>
					<span>{$t("common.newSimulation")}</span>
				</a>
			</li>
			<li>
				<a href="/simulations/">
					<span class="badge"><ChevronRight /></span>
					<span>{$t("common.savedSimulations")}</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="flex-grow ltr:ml-[0.5%] rtl:mr-[0.5%]"></div>
</div>
