import { EstadoEdificio } from '../models/RegistroAcceso.model.js';
import { EmpleadoDTO, EmpleadoService } from '../services/EmpleadoService.js';
import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { ReporteParams, ReporteService } from '../services/ReporteService.js';
import { RRHHView } from '../views/RRHHView.js';

export class RRHHController {
  private readonly empleadoService = new EmpleadoService();
  private readonly reporteService = new ReporteService();
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();
  private asistenciaData: unknown[] = [];
  private puntualidadData: unknown[] = [];
  private editingEmpleadoId: string | null = null;

  constructor(private readonly view: RRHHView) {
    this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
  }

  public init(): void {
    this.view.render();
    this.bindViewCallbacks();
    void this.loadEmpleados();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
    this.setDefaultDateRange();
  }

  private bindViewCallbacks(): void {
    this.view.bindSaveEmpleado(async (data, id) => {
      await this.onSaveEmpleado(data as EmpleadoDTO, id);
    });
    this.view.bindEditEmpleado((id) => {
      this.onEditEmpleado(id);
    });
    this.view.bindDeactivateEmpleado(async (id) => {
      await this.onDeleteEmpleado(id);
    });
    this.view.bindGenerarAsistencia(async (params) => {
      await this.onGenerarReporteAsistencia(params as ReporteParams);
    });
    this.view.bindExportarAsistencia(() => {
      this.onExportarCSV(this.asistenciaData as Record<string, unknown>[], 'reporte-asistencia.csv');
    });
    this.view.bindGenerarPuntualidad(async (params) => {
      await this.onGenerarReportePuntualidad(params as ReporteParams);
    });
    this.view.bindExportarPuntualidad(() => {
      this.onExportarCSV(this.puntualidadData as Record<string, unknown>[], 'reporte-puntualidad.csv');
    });
  }

  private async onSaveEmpleado(data: EmpleadoDTO, id?: string): Promise<void> {
    try {
      if (id) {
        await this.empleadoService.update(id, data);
        this.view.showSuccess('Empleado actualizado correctamente');
      } else {
        await this.empleadoService.create(data);
        this.view.showSuccess('Empleado creado correctamente');
      }
      this.view.closeEmpleadoModal();
      await this.loadEmpleados();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error al guardar el empleado');
    }
  }

  private onEditEmpleado(id: string): void {
    this.editingEmpleadoId = id;
    this.empleadoService
      .getAll()
      .then((empleados) => {
        const emp = empleados.find((item) => item.id === id);
        if (emp) {
          this.view.openEmpleadoModal(emp);
        }
      })
      .catch(() => {
        this.view.showError('No se pudo cargar el empleado');
      });
  }

  private async onDeleteEmpleado(id: string): Promise<void> {
    const confirmed = window.confirm('¿Desactivar este empleado?');
    if (!confirmed) return;
    try {
      await this.empleadoService.delete(id);
      this.view.showSuccess('Empleado desactivado');
      await this.loadEmpleados();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error al desactivar');
    }
  }

  private async onGenerarReporteAsistencia(params: ReporteParams): Promise<void> {
    try {
      const rows = await this.reporteService.getAsistencia(params);
      this.asistenciaData = rows;
      this.view.renderReporteAsistencia(rows);
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error al generar reporte');
    }
  }

  private async onGenerarReportePuntualidad(params: ReporteParams): Promise<void> {
    try {
      const rows = await this.reporteService.getPuntualidad(params);
      this.puntualidadData = rows;
      this.view.renderReportePuntualidad(rows);
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error al generar reporte');
    }
  }

  private onExportarCSV(data: Record<string, unknown>[], filename: string): void {
    if (!data.length) {
      this.view.showError('No hay datos para exportar');
      return;
    }
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = String(row[header] ?? '').replace(/"/g, '""');
            return `"${value}"`;
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
    try {
      const empleados = await this.empleadoService.getAll();
      this.view.renderEmpleadosTable(empleados);
    } catch (error) {
      this.view.showError('No se pudo cargar la lista de empleados');
    }
  }

  private setDefaultDateRange(): void {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    ['asistencia-fecha-inicio', 'puntualidad-fecha-inicio'].forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = weekAgo;
    });
    ['asistencia-fecha-fin', 'puntualidad-fecha-fin'].forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) el.value = today;
    });
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