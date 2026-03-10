import { AuthStore } from './AuthStore';

export class ApiClient {
  private readonly baseUrl = 'http://localhost:3000/api/1.0';
  private readonly authStore = AuthStore.getInstance();

  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const token = this.authStore.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'GET');
  }

  public async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, 'POST', body);
  }

  public async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, 'PUT', body);
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE');
  }

  private async request<T>(endpoint: string, method: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: this.getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async handleError(response: Response): Promise<never> {
    if (response.status === 401) {
      this.authStore.clear();
      window.location.href = '/index.html';
      throw new Error('Sesión expirada');
    }

    let message = 'Error inesperado en la solicitud';

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }
}
