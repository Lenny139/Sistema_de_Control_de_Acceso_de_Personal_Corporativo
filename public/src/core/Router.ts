import { AuthStore } from './AuthStore.js';

export class Router {
  private readonly authStore = AuthStore.getInstance();

  public navigate(path: string): void {
    window.location.href = path;
  }

  public redirectToLogin(): void {
    this.authStore.clear();
    this.navigate('/index.html');
  }

  public checkAccess(allowedRoles: string[]): void {
    if (!this.authStore.isAuthenticated() || !this.hasValidToken()) {
      this.redirectToLogin();
      return;
    }

    const role = this.authStore.getRole();
    if (!role || !allowedRoles.includes(role)) {
      this.redirectToLogin();
    }
  }

  private hasValidToken(): boolean {
    const token = this.authStore.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
      if (!payload.exp) {
        return true;
      }

      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
