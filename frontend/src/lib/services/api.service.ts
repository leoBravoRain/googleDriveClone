// TODO: move to .env file?
export const API_BASE_URL = 'http://localhost:8000/api/';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}