import { EstadoEdificio, EstadoPresencia } from '../models/RegistroAcceso.model';
import { Visitante } from '../models/Visitante.model';
import { AccessRecordService } from './AccessRecordService';
import { VisitanteService } from './VisitanteService';

export class EstadoEdificioService {
  private static instance: EstadoEdificioService;
  private readonly storageKey = 'control-acceso-estado-edificio';

  private presentes: EstadoPresencia[] = [];
  private visitantesPresentes: Visitante[] = [];
  private lastUpdate: Date | null = null;
  private listeners: Set<(data: EstadoEdificio) => void> = new Set();
  private autoRefreshId: number | null = null;
  private readonly accessRecordService = new AccessRecordService();
  private readonly visitanteService = new VisitanteService();

  private constructor() {
    this.hydrateFromStorage();

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.key !== this.storageKey || !event.newValue) {
        return;
      }

      this.hydrateFromStorage();
      this.notifyListeners();
    });
  }

  public static getInstance(): EstadoEdificioService {
    if (!EstadoEdificioService.instance) {
      EstadoEdificioService.instance = new EstadoEdificioService();
    }

    return EstadoEdificioService.instance;
  }

  public subscribe(callback: (data: EstadoEdificio) => void): void {
    this.listeners.add(callback);
  }

  public unsubscribe(callback: (data: EstadoEdificio) => void): void {
    this.listeners.delete(callback);
  }

  public async refresh(): Promise<void> {
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

  public getPresentes(): EstadoPresencia[] {
    return [...this.presentes];
  }

  public getVisitantesPresentes(): Visitante[] {
    return [...this.visitantesPresentes];
  }

  public getLastUpdate(): Date | null {
    return this.lastUpdate;
  }

  public getTotalPresentes(): number {
    return this.presentes.length + this.visitantesPresentes.length;
  }

  public startAutoRefresh(intervalSeconds: number): void {
    this.stopAutoRefresh();

    this.autoRefreshId = window.setInterval(() => {
      void this.refresh();
    }, intervalSeconds * 1000);
  }

  public stopAutoRefresh(): void {
    if (this.autoRefreshId !== null) {
      window.clearInterval(this.autoRefreshId);
      this.autoRefreshId = null;
    }
  }

  private notifyListeners(): void {
    const snapshot: EstadoEdificio = {
      presentes: this.getPresentes(),
      visitantesPresentes: this.getVisitantesPresentes(),
      lastUpdate: this.getLastUpdate(),
      totalPresentes: this.getTotalPresentes(),
    };

    this.listeners.forEach((listener) => listener(snapshot));
  }

  private persistSnapshot(): void {
    const payload = {
      presentes: this.presentes,
      visitantesPresentes: this.visitantesPresentes,
      lastUpdate: this.lastUpdate ? this.lastUpdate.toISOString() : null,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }

  private hydrateFromStorage(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as {
        presentes?: EstadoPresencia[];
        visitantesPresentes?: Visitante[];
        lastUpdate?: string | null;
      };

      this.presentes = parsed.presentes ?? [];
      this.visitantesPresentes = parsed.visitantesPresentes ?? [];
      this.lastUpdate = parsed.lastUpdate ? new Date(parsed.lastUpdate) : null;
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }
}
