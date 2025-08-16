import type { FileData } from "$lib/types/files.types";

import { apiBlobRequest, apiRequest } from "./api.service";

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
        return apiBlobRequest(`files/${fileId}/download`);
    }

    static async deleteFile(fileId: string): Promise<void> {
        return apiRequest<void>(`files/${fileId}`, {
            method: 'DELETE',
        })
    }
}
