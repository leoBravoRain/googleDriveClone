<script lang="ts">
	import { onMount } from 'svelte';

	import type { FileData } from '../types/files.types';

	import { FileService } from '$lib/services/files.service';
	import { formatDate, formatFileSize } from '$lib/utils/formatters.utils';
	
	// State variables
	let files: FileData[] = [];
	let loading = true;
	let error = '';
	
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
	
	onMount(async() => {
		files = await FileService.getFiles();
	});
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
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	{/if}
</div>
