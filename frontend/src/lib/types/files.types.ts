export interface FileData {
	file_id: string;
	filename: string;
	size: number;
	file_type: string;
	upload_date: string;
	original_name: string;
}

export interface PaginationInfo {
	current_page: number;
	total_pages: number;
	total_files: number;
	files_per_page: number;
	has_next: boolean;
	has_prev: boolean;
	next_page: number | null;
	prev_page: number | null;
}

export interface FilesResponse {
	files: FileData[];
	pagination: PaginationInfo;
}
