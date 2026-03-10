export class ThemeManager {
    constructor() {
        this.key = 'control-acceso-theme';
    }
    static getInstance() {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }
    init() {
        const saved = localStorage.getItem(this.key);
        if (saved === 'dark' || saved === 'light') {
            this.apply(saved);
            return;
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.apply(prefersDark ? 'dark' : 'light');
    }
    toggle() {
        const next = this.getTheme() === 'dark' ? 'light' : 'dark';
        this.apply(next);
    }
    getTheme() {
        const theme = document.body.getAttribute('data-theme');
        return theme === 'dark' ? 'dark' : 'light';
    }
    apply(theme) {
        document.body.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.key, theme);
    }
}
