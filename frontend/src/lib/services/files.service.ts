import type { FileData, FilesResponse } from '$lib/types/files.types';

import { apiBlobRequest, apiRequest } from './api.service';

export class FileService {
	static async getFiles(page: number = 1, limit: number = 10): Promise<FilesResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});
		return apiRequest<FilesResponse>(`files?${params.toString()}`);
	}

	static async uploadFile(file: File): Promise<FileData> {
		const formData = new FormData();
		formData.append('file', file);
		return apiRequest<FileData>('files', {
			method: 'POST',
			body: formData
		});
	}

	static async downloadFile(fileId: string): Promise<Blob> {
		return apiBlobRequest(`files/${fileId}/download`);
	}

	static async deleteFile(fileId: string): Promise<void> {
		return apiRequest<void>(`files/${fileId}`, {
			method: 'DELETE'
		});
	}

	static async renameFile(fileId: string, newName: string): Promise<void> {
		return apiRequest<void>(`files/${fileId}?file_name=${encodeURIComponent(newName)}`, {
			method: 'PATCH'
		});
	}
}
