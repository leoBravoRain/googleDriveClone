import type { FileData } from "$lib/types/files.types";

import { API_BASE_URL, apiRequest } from "./api.service";

export class FileService {
    static async getFiles(): Promise<FileData[]> {
        return apiRequest<{files: FileData[]}>('files').then(data => data.files)
    }

    static async uploadFile(file: File): Promise<FileData> {
        const formData = new FormData();
        formData.append('file', file);
        return apiRequest<FileData>('files', {
            method: 'POST',
            body: formData,
        })
    }

    static async downloadFile(fileId: string): Promise<Blob> {
        // TODO: move to apiBlobRequest?
        const response = await fetch(`${API_BASE_URL}files/${fileId}/download`);
        if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
        }
        return response.blob();
    }
}