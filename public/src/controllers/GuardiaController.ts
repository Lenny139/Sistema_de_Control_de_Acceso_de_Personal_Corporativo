import { Empleado } from '../models/Empleado.model.js';
import { EstadoEdificio } from '../models/RegistroAcceso.model.js';
import { AccessRecordService } from '../services/AccessRecordService.js';
import { CheckpointService } from '../services/CheckpointService.js';
import { EmpleadoService } from '../services/EmpleadoService.js';
import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { RegistrarVisitantePayload, VisitanteService } from '../services/VisitanteService.js';
import { GuardiaView } from '../views/GuardiaView.js';

export class GuardiaController {
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();
  private readonly empleadoService = new EmpleadoService();
  private readonly accessRecordService = new AccessRecordService();
  private readonly checkpointService = new CheckpointService();
  private readonly visitanteService = new VisitanteService();
  private currentEmpleadoId: string | null = null;
  private lastSearchResults: Empleado[] = [];

  constructor(private readonly view: GuardiaView) {
    this.estadoEdificioService.subscribe(this.onEstadoChange);
  }

  public init(): void {
    this.view.bindSearch((query) => this.onEmpleadoSearch(query));
    this.view.bindSelect((empleadoId, nombre) => void this.onEmpleadoSelect(empleadoId, nombre));
    this.view.bindCheckIn((empleadoId, puntoControlId, observaciones) =>
      this.onCheckIn(empleadoId, puntoControlId, observaciones),
    );
    this.view.bindCheckOut((empleadoId, puntoControlId) => this.onCheckOut(empleadoId, puntoControlId));
    this.view.bindRegistrarVisitante((payload) => this.onRegistrarVisitante(payload));
    this.view.bindSalidaVisitante((visitanteId) => this.onSalidaVisitante(visitanteId));
    this.view.bindRefresh(() => this.estadoEdificioService.refresh());
    this.view.render();
    void this.loadCheckpoints();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
  }

  public async onEmpleadoSearch(query: string): Promise<void> {
    try {
      const results = await this.empleadoService.search(query.trim());
      this.view.renderSearchResults(results);
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo buscar el empleado');
    }
  }

  public async onEmpleadoSelect(empleadoId: string, nombre: string): Promise<void> {
    try {
      const estaPresente = this.estadoEdificioService
        .getPresentes()
        .some((presencia) => presencia.empleadoId === empleadoId);

      const empleados = await this.empleadoService.getAll();
      const empleado = empleados.find((item) => item.id === empleadoId);
      if (!empleado) {
        this.view.showError(`No se encontro el empleado ${nombre}`);
        return;
      }

      this.currentEmpleadoId = empleadoId;
      this.view.renderEmpleadoBuscado(empleado, estaPresente);
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo cargar el empleado');
    }
  }

  public async onCheckIn(
    empleadoId: string,
    puntoControlId: string,
    observaciones?: string,
  ): Promise<void> {
    try {
      const targetEmpleadoId = this.currentEmpleadoId ?? empleadoId;
      if (!targetEmpleadoId) {
        this.view.showError('Selecciona un empleado antes de registrar la entrada');
        return;
      }

      await this.accessRecordService.checkIn(targetEmpleadoId, puntoControlId, observaciones);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Entrada registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la entrada');
    }
  }

  public async onCheckOut(empleadoId: string, puntoControlId: string): Promise<void> {
    try {
      const targetEmpleadoId = this.currentEmpleadoId ?? empleadoId;
      if (!targetEmpleadoId) {
        this.view.showError('Selecciona un empleado antes de registrar la salida');
        return;
      }

      await this.accessRecordService.checkOut(targetEmpleadoId, puntoControlId);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Salida registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
    }
  }

  public async onRegistrarVisitante(datos: RegistrarVisitantePayload | Record<string, string>): Promise<void> {
    try {
      const payload = datos as RegistrarVisitantePayload;
      await this.visitanteService.registrarEntrada(payload);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Entrada de visitante registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar el visitante');
    }
  }

  public async onSalidaVisitante(visitanteId: string): Promise<void> {
    try {
      await this.visitanteService.registrarSalida(visitanteId);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Salida de visitante registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
    }
  }

  public async onRefresh(): Promise<void> {
    try {
      await this.estadoEdificioService.refresh();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo actualizar el estado');
    }
  }

  private readonly onEstadoChange = (estado: EstadoEdificio): void => {
    this.view.renderDashboardPresentes(estado);
  };

  private async loadCheckpoints(): Promise<void> {
    try {
      const checkpoints = await this.checkpointService.getAll();
      const select = document.getElementById('checkpoint-select') as HTMLSelectElement | null;
      if (!select) {
        return;
      }

      select.innerHTML = [
        '<option value="">Seleccionar punto de control</option>',
        ...checkpoints.map((cp) => `<option value="${cp.id}">${cp.nombre}</option>`),
      ].join('');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudieron cargar los puntos de control');
    }
  }

  public destroy(): void {
    this.estadoEdificioService.unsubscribe(this.onEstadoChange);
    this.estadoEdificioService.stopAutoRefresh();
  }
}
