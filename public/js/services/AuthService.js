import { ApiClient } from '../core/ApiClient.js';
import { AuthStore } from '../core/AuthStore.js';
export class AuthService {
    constructor() {
        this.api = new ApiClient();
        this.authStore = AuthStore.getInstance();
    }
    async login(username, password) {
        const response = await this.api.post('/auth/login', { username, password });
        this.authStore.setAuth(response.accessToken, response.user);
        return response;
    }
    logout() {
        this.authStore.clear();
    }
}
