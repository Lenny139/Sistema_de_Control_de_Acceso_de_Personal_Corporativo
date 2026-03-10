import { EmpleadoService } from '../services/EmpleadoService';
import { EstadoEdificioService } from '../services/EstadoEdificioService';
import { ReporteService } from '../services/ReporteService';
export class RRHHController {
    constructor(view) {
        this.view = view;
        this.empleadoService = new EmpleadoService();
        this.reporteService = new ReporteService();
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.onEstadoEdificioChanged = (estado) => {
            this.view.renderDashboardCards(estado);
            this.view.renderEstadoEdificio(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
    }
    init() {
        this.view.render();
        void this.loadEmpleados();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
    }
    async onCreateEmpleado(dto) {
        await this.empleadoService.create(dto);
        await this.loadEmpleados();
        this.view.showSuccess('Empleado creado correctamente');
    }
    async onUpdateEmpleado(id, dto) {
        await this.empleadoService.update(id, dto);
        await this.loadEmpleados();
        this.view.showSuccess('Empleado actualizado correctamente');
    }
    async onDeleteEmpleado(id) {
        const confirmed = window.confirm('¿Deseas desactivar este empleado?');
        if (!confirmed) {
            return;
        }
        await this.empleadoService.delete(id);
        await this.loadEmpleados();
        this.view.showSuccess('Empleado desactivado');
    }
    async onGenerarReporteAsistencia(params) {
        const rows = await this.reporteService.getAsistencia(params);
        this.view.renderReporteAsistencia(rows);
    }
    async onGenerarReportePuntualidad(params) {
        const rows = await this.reporteService.getPuntualidad(params);
        this.view.renderReportePuntualidad(rows);
    }
    onExportarCSV(data, filename) {
        if (!data.length) {
            return;
        }
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map((row) => headers
                .map((header) => {
                const value = row[header] ?? '';
                const escaped = String(value).replace(/"/g, '""');
                return `"${escaped}"`;
            })
                .join(',')),
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }
    async loadEmpleados() {
        const empleados = await this.empleadoService.getAll();
        this.view.renderEmpleadosTable(empleados);
    }
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
