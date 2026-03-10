import { AuthStore } from './AuthStore';
export class Router {
    constructor() {
        this.authStore = AuthStore.getInstance();
    }
    navigate(path) {
        window.location.href = path;
    }
    redirectToLogin() {
        this.authStore.clear();
        this.navigate('/index.html');
    }
    checkAccess(allowedRoles) {
        if (!this.authStore.isAuthenticated() || !this.hasValidToken()) {
            this.redirectToLogin();
            return;
        }
        const role = this.authStore.getRole();
        if (!role || !allowedRoles.includes(role)) {
            this.redirectToLogin();
        }
    }
    hasValidToken() {
        const token = this.authStore.getToken();
        if (!token) {
            return false;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.exp) {
                return true;
            }
            return payload.exp * 1000 > Date.now();
        }
        catch {
            return false;
        }
    }
}
