<script lang="ts" generics="T">       
	export let promise: Promise<T>;

	let previousPromise = promise;
	let result: T;
	let reloading = false;

	$: updateResult(promise);

	async function updateResult(newPromise: Promise<T>): Promise<void> {
		reloading = true;
		result = await promise;
		reloading = false;
	}
</script>

{#await previousPromise}
	<slot name="loading" />
{:then ignored}
	<slot then={result} pending={reloading} />
{:catch error}
	<slot name="error" {error} />
{/await}