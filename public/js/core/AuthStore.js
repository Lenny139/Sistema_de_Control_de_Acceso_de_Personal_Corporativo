export class AuthStore {
    constructor() {
        this.storageKey = 'control-acceso-auth';
        this.auth = { token: null, user: null };
        this.hydrate();
    }
    static getInstance() {
        if (!AuthStore.instance) {
            AuthStore.instance = new AuthStore();
        }
        return AuthStore.instance;
    }
    setAuth(token, user) {
        this.auth = { token, user };
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.auth));
    }
    getToken() {
        if (this.auth.token) {
            return this.auth.token;
        }
        this.hydrate();
        return this.auth.token;
    }
    getUser() {
        if (this.auth.user) {
            return this.auth.user;
        }
        this.hydrate();
        return this.auth.user;
    }
    getRole() {
        const user = this.getUser();
        return user?.role ?? null;
    }
    isAuthenticated() {
        return Boolean(this.getToken() && this.getUser());
    }
    clear() {
        this.auth = { token: null, user: null };
        sessionStorage.removeItem(this.storageKey);
    }
    hydrate() {
        const raw = sessionStorage.getItem(this.storageKey);
        if (!raw) {
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            this.auth = {
                token: parsed.token ?? null,
                user: parsed.user ?? null,
            };
        }
        catch {
            this.clear();
        }
    }
}
