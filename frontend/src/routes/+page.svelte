<script lang="ts">
	import { onMount } from 'svelte';
	
	const API_BASE_URL = 'http://localhost:8000';
	
	// TODO: separate responsabilities (creating a service?)
	// File data structure
	interface FileData {
		file_id: string;
		filename: string;
		size: number;
		file_type: string;
		upload_date: string;
		original_name: string;
	}
	
	// State variables
	let files: FileData[] = [];
	let loading = true;
	let error = '';
	
	// Fetch files from backend
	async function fetchFiles() {
		try {
			loading = true;
			error = '';
			
			const response = await fetch(`${API_BASE_URL}/api/files`);
			
			if (response.ok) {
				const data = await response.json();
				files = data.files || data; // Handle both array and object with files property
				console.log('Files loaded:', files);
			} else {
				error = `Failed to load files: ${response.status} ${response.statusText}`;
			}
		} catch (err) {
			error = `Error connecting to backend: ${err}`;
			console.error('Error fetching files:', err);
		} finally {
			loading = false;
		}
	}
	
	// Format file size
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}
	
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
	
	onMount(() => {
		fetchFiles();
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
		<!-- File list -->
		<div>
			<button onclick={fetchFiles}>Refresh Files</button>
			<span>Total files: {files.length}</span>
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
