import type { FileData } from "$lib/types/files.types";

import { apiRequest } from "./api.service";

export class FileService {
    static async getFiles(): Promise<FileData[]> {
        return apiRequest<{files: FileData[]}>('files').then(data => data.files)
    }
}