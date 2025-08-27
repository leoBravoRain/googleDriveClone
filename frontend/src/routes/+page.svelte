<script lang="ts">
	import { onMount } from 'svelte';

	import type { FileData, PaginationInfo } from '$lib/types/files.types';

	import { FileService } from '$lib/services/files.service';

	import { formatDate, formatFileSize } from '$lib/utils/formatters.utils';

	// State variables
	let files: FileData[] = [];
	let loading = true;
	let error = '';
	let fileInput: FileList | null = null;
	let editingFileId: string | null = null;
	let editingFileName: string = '';

	// Pagination state
	let currentPage = 1;
	let filesPerPage = 5;
	let pagination: PaginationInfo | null = null;

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

	async function fetchFiles(page: number = currentPage) {
		try {
			loading = true;
			error = '';
			const response = await FileService.getFiles(page, filesPerPage);
			files = response.files;
			pagination = response.pagination;
			currentPage = page;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load files';
			console.error('Error loading files:', err);
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		await fetchFiles();
	});

	async function handleUpload() {
		if (!fileInput || fileInput.length === 0) return;
		const file = fileInput[0];
		try {
			await FileService.uploadFile(file);
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

	// Pagination functions
	async function goToPage(page: number) {
		if (page >= 1 && pagination && page <= pagination.total_pages) {
			await fetchFiles(page);
		}
	}

	async function nextPage() {
		if (pagination && pagination.has_next) {
			await fetchFiles(currentPage + 1);
		}
	}

	async function prevPage() {
		if (pagination && pagination.has_prev) {
			await fetchFiles(currentPage - 1);
		}
	}
</script>

<div class="min-h-screen bg-gray-50 p-4">
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-8 text-3xl font-bold text-gray-800">Google Drive Clone</h1>

		<!-- Loading state -->
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="text-gray-600">Loading files...</div>
			</div>
		{:else if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<p class="text-red-700">{error}</p>
			</div>
		{:else}
			<!-- Upload section -->
			<div class="mb-6 rounded-lg border bg-white p-6 shadow-sm">
				<label for="fileInput" class="mb-2 block text-sm font-medium text-gray-700"
					>Upload File</label
				>
				<div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
					<input
						type="file"
						bind:files={fileInput}
						id="fileInput"
						name="fileInput"
						accept="image/*, video/*, audio/*, .pdf, .txt, .zip, .rar"
						class="w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 sm:flex-1"
					/>
					<button
						onclick={handleUpload}
						disabled={loading || !fileInput || fileInput.length === 0}
						class="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 sm:w-auto"
					>
						Upload
					</button>
				</div>
			</div>

			<!-- File list -->
			{#if files.length === 0}
				<div class="rounded-lg border bg-white p-12 text-center shadow-sm">
					<p class="text-gray-500">No files found. Upload some files to get started!</p>
				</div>
			{:else}
				<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>File</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Size</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Type</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Upload Date</th
									>
									<th
										class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
										>Actions</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 bg-white">
								{#each files as file (file.file_id)}
									<tr class="hover:bg-gray-50">
										<td class="px-6 py-4 whitespace-nowrap">
											<div class="flex items-center">
												<span class="mr-3 text-xl">{getFileIcon(file.file_type)}</span>
												{#if editingFileId === file.file_id}
													<div class="flex items-center gap-2">
														<input
															type="text"
															bind:value={editingFileName}
															onkeydown={handleKeyPress}
															class="rounded border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
														/>
														<button
															onclick={saveEdit}
															class="cursor-pointer rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
														>
															Save
														</button>
														<button
															onclick={cancelEdit}
															class="cursor-pointer rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
														>
															Cancel
														</button>
													</div>
												{:else}
													<span class="text-sm font-medium text-gray-900">{file.filename}</span>
												{/if}
											</div>
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{formatFileSize(file.size)}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{file.file_type}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
											{formatDate(file.upload_date)}
										</td>
										<td class="px-6 py-4 text-sm whitespace-nowrap">
											<div class="flex gap-2">
												<button
													onclick={() => handleDownload(file.file_id, file.filename)}
													class="cursor-pointer rounded bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700"
												>
													Download
												</button>
												<button
													onclick={() => startEdit(file.file_id, file.filename)}
													class="cursor-pointer rounded bg-yellow-600 px-3 py-1 text-xs text-white transition-colors hover:bg-yellow-700"
												>
													Rename
												</button>
												<button
													onclick={() => handleDelete(file.file_id)}
													class="cursor-pointer rounded bg-red-600 px-3 py-1 text-xs text-white transition-colors hover:bg-red-700"
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

				<!-- Pagination -->
				{#if pagination && pagination.total_pages > 1}
					<div class="mt-4 rounded-lg border bg-white p-4 shadow-sm">
						<div class="flex items-center justify-between">
							<div class="text-sm text-gray-700">
								Showing page {pagination.current_page} of {pagination.total_pages}
								({pagination.total_files} total files)
							</div>
							<div class="flex items-center space-x-2">
								<button
									onclick={prevPage}
									disabled={!pagination.has_prev}
									class="cursor-pointer rounded bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
								>
									Previous
								</button>

								<!-- Page numbers -->
								<div class="flex items-center space-x-1">
									{#each Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
										const pageNum = i + 1;
										return pageNum;
									}) as pageNum (pageNum)}
										<button
											onclick={() => goToPage(pageNum)}
											class="cursor-pointer rounded px-3 py-1 text-sm transition-colors {pageNum ===
											pagination.current_page
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
										>
											{pageNum}
										</button>
									{/each}
								</div>

								<button
									onclick={nextPage}
									disabled={!pagination.has_next}
									class="cursor-pointer rounded bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
								>
									Next
								</button>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>
