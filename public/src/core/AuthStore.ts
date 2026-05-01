import { ERole, UsuarioAuth } from '../models/Usuario.model.js';

type AuthState = {
  token: string | null;
  user: UsuarioAuth | null;
};

export class AuthStore {
  private static instance: AuthStore;
  private readonly storageKey = 'control-acceso-auth';
  private auth: AuthState = { token: null, user: null };

  private constructor() {
    this.hydrate();
  }

  public static getInstance(): AuthStore {
    if (!AuthStore.instance) {
      AuthStore.instance = new AuthStore();
    }

    return AuthStore.instance;
  }

  public setAuth(token: string, user: UsuarioAuth): void {
    this.auth = { token, user };
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.auth));
  }

  public getToken(): string | null {
    if (this.auth.token) {
      return this.auth.token;
    }

    this.hydrate();
    return this.auth.token;
  }

  public getUser(): UsuarioAuth | null {
    if (this.auth.user) {
      return this.auth.user;
    }

    this.hydrate();
    return this.auth.user;
  }

  public getRole(): ERole | null {
    const user = this.getUser();
    return user?.role ?? null;
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken() && this.getUser());
  }

  public clear(): void {
    this.auth = { token: null, user: null };
    sessionStorage.removeItem(this.storageKey);
  }

  private hydrate(): void {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthState;
      this.auth = {
        token: parsed.token ?? null,
        user: parsed.user ?? null,
      };
    } catch {
      this.clear();
    }
  }
}
