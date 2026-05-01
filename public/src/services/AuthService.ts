import { ApiClient } from '../core/ApiClient.js';
import { AuthStore } from '../core/AuthStore.js';
import { LoginResponse } from '../models/Usuario.model.js';

export class AuthService {
  private readonly api = new ApiClient();
  private readonly authStore = AuthStore.getInstance();

  public async login(username: string, password: string): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>('/auth/login', { username, password });
    this.authStore.setAuth(response.accessToken, response.user);
    return response;
  }

  public logout(): void {
    this.authStore.clear();
  }
}
