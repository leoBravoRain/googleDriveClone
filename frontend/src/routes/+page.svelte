<script lang="ts">
	import { onMount } from 'svelte';

	import type { FileData } from '$lib/types/files.types';

	import { FileService } from '$lib/services/files.service';
	import { formatDate, formatFileSize } from '$lib/utils/formatters.utils';
	
	// State variables
	let files: FileData[] = [];
	let loading = true;
	let error = '';
	let fileInput: FileList | null = null;

	// Get file icon based on type
	function getFileIcon(fileType: string): string {
		if (fileType.startsWith('image/')) return '🖼️';
		if (fileType.startsWith('video/')) return '🎥';
		if (fileType.startsWith('audio/')) return '🎵';
		if (fileType.includes('pdf')) return '📄';
		if (fileType.includes('text')) return '📝';
		if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
		return '📁';
	}
	

	async function fetchFiles() {
		try {
			loading = true;
			error = '';
			files = await FileService.getFiles();
		}
		catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load files';
			console.error('Error loading files:', err);
		}
		finally {
			loading = false;
		}
	}

	onMount(async() => {
		await fetchFiles();
	});

	async function handleUpload() {
		if (!fileInput || fileInput.length === 0) return;
		const file = fileInput[0];
		const uploadedFile = await FileService.uploadFile(file);
		// TODO: error handling?

		// reload files
		await fetchFiles();
	}

	async function handleDownload(fileId: string, filename: string) {
		try {
			const blob = await FileService.downloadFile(fileId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Download failed:', error);
			alert('Download failed, try again');
		}
	}

	async function handleDelete(fileId: string) {
		if (confirm('Are you sure you want to delete this file?')) {
			await FileService.deleteFile(fileId);
			await fetchFiles();
		}
	}
</script>

<div>
	<h1>Google Drive Clone - File Manager</h1>
	
	<!-- Loading state -->
	{#if loading}
		<div>
			<p>Loading files...</p>
		</div>
	{:else if error}
		<div>
			<p>{error}</p>
		</div>
	{:else}

		<!-- upload file -->
		<div>
			<label for="fileInput">Upload File</label>
			<input type="file" bind:files={fileInput} id="fileInput" name="fileInput" accept="image/*, video/*, audio/*, .pdf, .txt, .zip, .rar"/>
			<button onclick={handleUpload}>Upload</button>
		</div>

		{#if files.length === 0}
			<div>
				<p>No files found. Upload some files to get started!</p>
			</div>
		{:else}
			<table>
				<thead>
					<tr>
						<th>File</th>
						<th>Size</th>
						<th>Type</th>
						<th>Upload Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each files as file}
						<tr>
							<td>
								<span>{getFileIcon(file.file_type)}</span>
								<span>{file.filename}</span>
							</td>
							<td>{formatFileSize(file.size)}</td>
							<td>{file.file_type}</td>
							<td>{formatDate(file.upload_date)}</td>
							<td>
								<button onclick={() => handleDownload(file.file_id, file.filename)}>Download</button>
								<button onclick={() => handleDelete(file.file_id)}>Delete</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}
</div>
