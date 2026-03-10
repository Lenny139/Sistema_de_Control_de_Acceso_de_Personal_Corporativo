export class EstadoEdificio {
  private static instance: EstadoEdificio;
  private language: 'es' | 'en' = 'es';
  private token: string | null = null;

  private constructor() {}

  static getInstance = (): EstadoEdificio => {
    if (!EstadoEdificio.instance) {
      EstadoEdificio.instance = new EstadoEdificio();
    }

    return EstadoEdificio.instance;
  };

  readonly getLanguage = (): 'es' | 'en' => this.language;
  readonly setLanguage = (language: 'es' | 'en'): void => {
    this.language = language;
  };

  readonly getToken = (): string | null => this.token;
  readonly setToken = (token: string | null): void => {
    this.token = token;
  };
}
