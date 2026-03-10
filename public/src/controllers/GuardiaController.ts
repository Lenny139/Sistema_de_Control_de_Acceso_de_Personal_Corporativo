import { Empleado } from '../models/Empleado.model';
import { EstadoEdificio } from '../models/RegistroAcceso.model';
import { AccessRecordService } from '../services/AccessRecordService';
import { EmpleadoService } from '../services/EmpleadoService';
import { EstadoEdificioService } from '../services/EstadoEdificioService';
import { RegistrarVisitantePayload, VisitanteService } from '../services/VisitanteService';
import { GuardiaView } from '../views/GuardiaView';

export class GuardiaController {
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();
  private readonly empleadoService = new EmpleadoService();
  private readonly accessRecordService = new AccessRecordService();
  private readonly visitanteService = new VisitanteService();

  constructor(private readonly view: GuardiaView) {
    this.estadoEdificioService.subscribe(this.onEstadoChange);
  }

  public init(): void {
    this.view.render();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
  }

  public async onEmpleadoSearch(query: string): Promise<Empleado[]> {
    if (query.trim().length < 3) {
      return [];
    }

    return this.empleadoService.search(query.trim());
  }

  public onEmpleadoSelect(empleado: Empleado): void {
    const estaPresente = this.estadoEdificioService
      .getPresentes()
      .some((presencia) => presencia.empleadoId === empleado.id);

    this.view.renderEmpleadoBuscado(empleado, estaPresente);
  }

  public async onCheckIn(
    empleadoId: string,
    puntoControlId: string,
    observaciones?: string,
  ): Promise<void> {
    try {
      await this.accessRecordService.checkIn(empleadoId, puntoControlId, observaciones);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Entrada registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la entrada');
    }
  }

  public async onCheckOut(empleadoId: string, puntoControlId: string): Promise<void> {
    try {
      await this.accessRecordService.checkOut(empleadoId, puntoControlId);
      await this.estadoEdificioService.refresh();
      this.view.showSuccess('Salida registrada correctamente');
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
    }
  }

  public async onRegistrarVisitante(datos: RegistrarVisitantePayload): Promise<void> {
    try {
      await this.visitanteService.registrarEntrada(datos);
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

  private readonly onEstadoChange = (estado: EstadoEdificio): void => {
    this.view.renderDashboardPresentes(estado);
  };

  public destroy(): void {
    this.estadoEdificioService.unsubscribe(this.onEstadoChange);
    this.estadoEdificioService.stopAutoRefresh();
  }
}
