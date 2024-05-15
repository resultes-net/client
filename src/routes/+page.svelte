<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';

	let fileList: FileList;

	async function onChangeHandler(event: Event): Promise<void> {
		console.assert(fileList.length === 1);
		const file = fileList[0];
		await uploadFile(file);
	}

	async function uploadFile(file: File): Promise<void> {
		const formData = new FormData();

		formData.append('file', file);

		try {
			const response = await fetch('http://localhost:8000/profiles', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (response.ok) {
				console.log('Result:', result);
			} else {
				console.error('Error:', result);
			}
		} catch (error) {
			console.error('Error:', error);
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
