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
	let editingFileId: string | null = null;
	let editingFileName: string = '';

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
		try {
			const uploadedFile = await FileService.uploadFile(file);
			// Clear the form after successful upload
			fileInput = null;
			// reload files
			await fetchFiles();
		} catch (error) {
			console.error('Upload failed:', error);
			alert('Upload failed, try again');
		}
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

	function startEdit(fileId: string, currentName: string) {
		editingFileId = fileId;
		editingFileName = currentName;
	}

	function cancelEdit() {
		editingFileId = null;
		editingFileName = '';
	}

	async function saveEdit() {
		if (!editingFileId || editingFileName.trim() === '') {
			alert('File name cannot be empty');
			return;
		}

		try {
			await FileService.renameFile(editingFileId, editingFileName.trim());
			await fetchFiles(); // Reload files to get updated data
			cancelEdit();
		} catch (error) {
			console.error('Rename failed:', error);
			alert('Failed to rename file');
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveEdit();
		} else if (event.key === 'Escape') {
			cancelEdit();
		}
	}
</script>

<div class="min-h-screen bg-gray-50 p-4">
	<div class="max-w-6xl mx-auto">
		<h1 class="text-3xl font-bold text-gray-800 mb-8">Google Drive Clone</h1>
		
		<!-- Loading state -->
		{#if loading}
			<div class="flex justify-center items-center py-12">
				<div class="text-gray-600">Loading files...</div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-700">{error}</p>
			</div>
		{:else}
			<!-- Upload section -->
			<div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
				<label for="fileInput" class="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
				<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
					<input 
						type="file" 
						bind:files={fileInput} 
						id="fileInput" 
						name="fileInput" 
						accept="image/*, video/*, audio/*, .pdf, .txt, .zip, .rar"
						class="w-full sm:flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					/>
					<button 
						onclick={handleUpload}
						disabled={loading || !fileInput || fileInput.length === 0}
						class="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 cursor-pointer"
					>
						Upload
					</button>
				</div>
			</div>

			<!-- File list -->
			{#if files.length === 0}
				<div class="bg-white rounded-lg shadow-sm border p-12 text-center">
					<p class="text-gray-500">No files found. Upload some files to get started!</p>
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow-sm border overflow-hidden">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each files as file}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<span class="text-xl mr-3">{getFileIcon(file.file_type)}</span>
												{#if editingFileId === file.file_id}
													<div class="flex items-center gap-2">
														<input 
															type="text" 
															bind:value={editingFileName}
															onkeydown={handleKeyPress}
															autofocus
															class="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
														<button 
															onclick={saveEdit}
															class="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 cursor-pointer"
														>
															Save
														</button>
														<button 
															onclick={cancelEdit}
															class="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 cursor-pointer"
														>
															Cancel
														</button>
													</div>
												{:else}
													<span class="text-sm font-medium text-gray-900">{file.filename}</span>
												{/if}
											</div>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatFileSize(file.size)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{file.file_type}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{formatDate(file.upload_date)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm">
											<div class="flex gap-2">
												<button 
													onclick={() => handleDownload(file.file_id, file.filename)}
													class="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors cursor-pointer"
												>
													Download
												</button>
												<button 
													onclick={() => startEdit(file.file_id, file.filename)}
													class="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors cursor-pointer"
												>
													Rename
												</button>
												<button 
													onclick={() => handleDelete(file.file_id)}
													class="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors cursor-pointer"
												>
													Delete
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
