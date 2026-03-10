import { EstadoEdificio } from '../models/EstadoEdificio';
import { MainView } from '../views/MainView';

type Dictionary = Record<string, string>;

export class MainController {
  private readonly state = EstadoEdificio.getInstance();

  constructor(private readonly view: MainView) {}

  readonly initialize = async (): Promise<void> => {
    await this.renderI18n();

    this.view.bindLanguageToggle(async () => {
      this.state.setLanguage(this.state.getLanguage() === 'es' ? 'en' : 'es');
      await this.renderI18n();
    });

    this.view.bindLogin(async (username, password) => {
      await this.login(username, password);
      await this.loadEmployees();
    });
  };

  private readonly login = async (username: string, password: string): Promise<void> => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = (await response.json()) as { token: string };
    this.state.setToken(data.token);
  };

  private readonly loadEmployees = async (): Promise<void> => {
    const token = this.state.getToken();

    if (!token) {
      return;
    }

    const response = await fetch('/api/v1/employees', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return;
    }

    const employees = (await response.json()) as Array<{ id: string; nombre: string; role: string }>;
    this.view.renderEmployees(employees);
  };

  private readonly renderI18n = async (): Promise<void> => {
    const language = this.state.getLanguage();
    const response = await fetch(`./i18n/${language}.json`);
    const messages = (await response.json()) as Dictionary;

    this.view.renderTexts(messages);

    const langButton = document.getElementById('langToggle');

    if (langButton) {
      langButton.textContent = language === 'es' ? 'EN' : 'ES';
    }
  };
}
