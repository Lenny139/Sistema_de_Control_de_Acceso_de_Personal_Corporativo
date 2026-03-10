import { EstadoEdificio } from '../models/RegistroAcceso.model';
import { EmpleadoDTO, EmpleadoService } from '../services/EmpleadoService';
import { EstadoEdificioService } from '../services/EstadoEdificioService';
import { ReporteParams, ReporteService } from '../services/ReporteService';
import { RRHHView } from '../views/RRHHView';

export class RRHHController {
  private readonly empleadoService = new EmpleadoService();
  private readonly reporteService = new ReporteService();
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();

  constructor(private readonly view: RRHHView) {
    this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
  }

  public init(): void {
    this.view.render();
    void this.loadEmpleados();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
  }

  public async onCreateEmpleado(dto: EmpleadoDTO): Promise<void> {
    await this.empleadoService.create(dto);
    await this.loadEmpleados();
    this.view.showSuccess('Empleado creado correctamente');
  }

  public async onUpdateEmpleado(id: string, dto: EmpleadoDTO): Promise<void> {
    await this.empleadoService.update(id, dto);
    await this.loadEmpleados();
    this.view.showSuccess('Empleado actualizado correctamente');
  }

  public async onDeleteEmpleado(id: string): Promise<void> {
    const confirmed = window.confirm('¿Deseas desactivar este empleado?');
    if (!confirmed) {
      return;
    }

    await this.empleadoService.delete(id);
    await this.loadEmpleados();
    this.view.showSuccess('Empleado desactivado');
  }

  public async onGenerarReporteAsistencia(params: ReporteParams): Promise<void> {
    const rows = await this.reporteService.getAsistencia(params);
    this.view.renderReporteAsistencia(rows);
  }

  public async onGenerarReportePuntualidad(params: ReporteParams): Promise<void> {
    const rows = await this.reporteService.getPuntualidad(params);
    this.view.renderReportePuntualidad(rows);
  }

  public onExportarCSV(data: Record<string, unknown>[], filename: string): void {
    if (!data.length) {
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] ?? '';
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(','),
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  private async loadEmpleados(): Promise<void> {
    const empleados = await this.empleadoService.getAll();
    this.view.renderEmpleadosTable(empleados);
  }

  private readonly onEstadoEdificioChanged = (estado: EstadoEdificio): void => {
    this.view.renderDashboardCards(estado);
    this.view.renderEstadoEdificio(estado);
  };

  public destroy(): void {
    this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
    this.estadoEdificioService.stopAutoRefresh();
  }
}
