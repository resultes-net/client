<script lang="ts">
	import * as res from 'ts-results';

	import { goto } from '$app/navigation';

	import { FileDropzone } from '@skeletonlabs/skeleton';

	import { container, type ProfileSummary } from '../profile_summary';

	let fileList: FileList;

	async function onChangeHandler(event: Event): Promise<void> {
		console.assert(fileList.length === 1);
		const file = fileList[0];
		const result = await uploadFileAndGetMonthlyData(file);

		if (result.err) {
			window.alert(result.val);
			return;
		}

		container.profileSummary = res.Some(result.val);

		goto('/profiles/plot-summary/');
	}

	async function uploadFileAndGetMonthlyData(
		file: File
	): Promise<res.Result<ProfileSummary, string>> {
		const formData = new FormData();

		formData.append('file', file);

		try {
			const response = await fetch('/api/profiles/', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Error:', result);
				const errorMessage = result.message;
				return new res.Err(`An error occured: ${errorMessage}`);
			}

			return new res.Ok(result);
		} catch (error) {
			return new res.Err(`An error occured: ${error}`);
		}
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">ResulTES</h1>
		<p>Upload a profile</p>
		<FileDropzone
			accept="text/csv"
			name="profile"
			required
			bind:files={fileList}
			on:change={onChangeHandler}
		>
			Upload
		</FileDropzone>
	</div>
</div>
