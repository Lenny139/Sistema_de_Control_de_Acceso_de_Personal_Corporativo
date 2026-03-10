export type Theme = 'light' | 'dark';

export class ThemeManager {
  private static instance: ThemeManager;
  private readonly key = 'control-acceso-theme';

  private constructor() {}

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }

    return ThemeManager.instance;
  }

  public init(): void {
    const saved = localStorage.getItem(this.key) as Theme | null;
    if (saved === 'dark' || saved === 'light') {
      this.apply(saved);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.apply(prefersDark ? 'dark' : 'light');
  }

  public toggle(): void {
    const next: Theme = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  public getTheme(): Theme {
    const theme = document.body.getAttribute('data-theme');
    return theme === 'dark' ? 'dark' : 'light';
  }

  private apply(theme: Theme): void {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
  }
}
