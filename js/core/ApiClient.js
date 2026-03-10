import { AuthStore } from './AuthStore';
export class ApiClient {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/1.0';
        this.authStore = AuthStore.getInstance();
    }
    getHeaders() {
        const headers = new Headers({
            'Content-Type': 'application/json',
        });
        const token = this.authStore.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
    async get(endpoint) {
        return this.request(endpoint, 'GET');
    }
    async post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }
    async put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    }
    async delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
    async request(endpoint, method, body) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers: this.getHeaders(),
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            await this.handleError(response);
        }
        if (response.status === 204) {
            return undefined;
        }
        return (await response.json());
    }
    async handleError(response) {
        if (response.status === 401) {
            this.authStore.clear();
            window.location.href = '/index.html';
            throw new Error('Sesión expirada');
        }
        let message = 'Error inesperado en la solicitud';
        try {
            const payload = (await response.json());
            if (payload.message) {
                message = payload.message;
            }
        }
        catch {
            message = response.statusText || message;
        }
        throw new Error(message);
    }
}
