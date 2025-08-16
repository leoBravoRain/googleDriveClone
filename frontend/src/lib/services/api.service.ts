// TODO: move to .env file?
export const API_BASE_URL = 'http://localhost:8000/api/';

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {};
    
    // Only set Content-Type if not sending FormData
    if (!(options?.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            ...headers,
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
}