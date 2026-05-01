import { AccessRecordService } from './AccessRecordService.js';
import { VisitanteService } from './VisitanteService.js';
export class EstadoEdificioService {
    constructor() {
        this.storageKey = 'control-acceso-estado-edificio';
        this.presentes = [];
        this.visitantesPresentes = [];
        this.lastUpdate = null;
        this.listeners = new Set();
        this.autoRefreshId = null;
        this.accessRecordService = new AccessRecordService();
        this.visitanteService = new VisitanteService();
        this.hydrateFromStorage();
        window.addEventListener('storage', (event) => {
            if (event.key !== this.storageKey || !event.newValue) {
                return;
            }
            this.hydrateFromStorage();
            this.notifyListeners();
        });
    }
    static getInstance() {
        if (!EstadoEdificioService.instance) {
            EstadoEdificioService.instance = new EstadoEdificioService();
        }
        return EstadoEdificioService.instance;
    }
    subscribe(callback) {
        this.listeners.add(callback);
    }
    unsubscribe(callback) {
        this.listeners.delete(callback);
    }
    async refresh() {
        const [presentes, visitantesPresentes] = await Promise.all([
            this.accessRecordService.getPresentes(),
            this.visitanteService.getPresentes(),
        ]);
        this.presentes = presentes;
        this.visitantesPresentes = visitantesPresentes;
        this.lastUpdate = new Date();
        this.persistSnapshot();
        this.notifyListeners();
    }
    getPresentes() {
        return [...this.presentes];
    }
    getVisitantesPresentes() {
        return [...this.visitantesPresentes];
    }
    getLastUpdate() {
        return this.lastUpdate;
    }
    getTotalPresentes() {
        return this.presentes.length + this.visitantesPresentes.length;
    }
    startAutoRefresh(intervalSeconds) {
        this.stopAutoRefresh();
        this.autoRefreshId = window.setInterval(() => {
            void this.refresh();
        }, intervalSeconds * 1000);
    }
    stopAutoRefresh() {
        if (this.autoRefreshId !== null) {
            window.clearInterval(this.autoRefreshId);
            this.autoRefreshId = null;
        }
    }
    notifyListeners() {
        const snapshot = {
            presentes: this.getPresentes(),
            visitantesPresentes: this.getVisitantesPresentes(),
            lastUpdate: this.getLastUpdate(),
            totalPresentes: this.getTotalPresentes(),
        };
        this.listeners.forEach((listener) => listener(snapshot));
    }
    persistSnapshot() {
        const payload = {
            presentes: this.presentes,
            visitantesPresentes: this.visitantesPresentes,
            lastUpdate: this.lastUpdate ? this.lastUpdate.toISOString() : null,
        };
        localStorage.setItem(this.storageKey, JSON.stringify(payload));
    }
    hydrateFromStorage() {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) {
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            this.presentes = parsed.presentes ?? [];
            this.visitantesPresentes = parsed.visitantesPresentes ?? [];
            this.lastUpdate = parsed.lastUpdate ? new Date(parsed.lastUpdate) : null;
        }
        catch {
            localStorage.removeItem(this.storageKey);
        }
    }
}
