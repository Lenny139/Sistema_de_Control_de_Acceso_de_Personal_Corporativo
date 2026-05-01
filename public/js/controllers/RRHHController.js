import { EmpleadoService } from '../services/EmpleadoService.js';
import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { ReporteService } from '../services/ReporteService.js';
export class RRHHController {
    constructor(view) {
        this.view = view;
        this.empleadoService = new EmpleadoService();
        this.reporteService = new ReporteService();
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.asistenciaData = [];
        this.puntualidadData = [];
        this.editingEmpleadoId = null;
        this.onEstadoEdificioChanged = (estado) => {
            this.view.renderDashboardCards(estado);
            this.view.renderEstadoEdificio(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
    }
    init() {
        this.view.render();
        this.bindViewCallbacks();
        void this.loadEmpleados();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
        this.setDefaultDateRange();
    }
    bindViewCallbacks() {
        this.view.bindSaveEmpleado(async (data, id) => {
            await this.onSaveEmpleado(data, id);
        });
        this.view.bindEditEmpleado((id) => {
            this.onEditEmpleado(id);
        });
        this.view.bindDeactivateEmpleado(async (id) => {
            await this.onDeleteEmpleado(id);
        });
        this.view.bindGenerarAsistencia(async (params) => {
            await this.onGenerarReporteAsistencia(params);
        });
        this.view.bindExportarAsistencia(() => {
            this.onExportarCSV(this.asistenciaData, 'reporte-asistencia.csv');
        });
        this.view.bindGenerarPuntualidad(async (params) => {
            await this.onGenerarReportePuntualidad(params);
        });
        this.view.bindExportarPuntualidad(() => {
            this.onExportarCSV(this.puntualidadData, 'reporte-puntualidad.csv');
        });
    }
    async onSaveEmpleado(data, id) {
        try {
            if (id) {
                await this.empleadoService.update(id, data);
                this.view.showSuccess('Empleado actualizado correctamente');
            }
            else {
                await this.empleadoService.create(data);
                this.view.showSuccess('Empleado creado correctamente');
            }
            this.view.closeEmpleadoModal();
            await this.loadEmpleados();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error al guardar el empleado');
        }
    }
    onEditEmpleado(id) {
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
    async onDeleteEmpleado(id) {
        const confirmed = window.confirm('¿Desactivar este empleado?');
        if (!confirmed)
            return;
        try {
            await this.empleadoService.delete(id);
            this.view.showSuccess('Empleado desactivado');
            await this.loadEmpleados();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error al desactivar');
        }
    }
    async onGenerarReporteAsistencia(params) {
        try {
            const rows = await this.reporteService.getAsistencia(params);
            this.asistenciaData = rows;
            this.view.renderReporteAsistencia(rows);
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error al generar reporte');
        }
    }
    async onGenerarReportePuntualidad(params) {
        try {
            const rows = await this.reporteService.getPuntualidad(params);
            this.puntualidadData = rows;
            this.view.renderReportePuntualidad(rows);
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error al generar reporte');
        }
    }
    onExportarCSV(data, filename) {
        if (!data.length) {
            this.view.showError('No hay datos para exportar');
            return;
        }
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map((row) => headers
                .map((header) => {
                const value = String(row[header] ?? '').replace(/"/g, '""');
                return `"${value}"`;
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
        try {
            const empleados = await this.empleadoService.getAll();
            this.view.renderEmpleadosTable(empleados);
        }
        catch (error) {
            this.view.showError('No se pudo cargar la lista de empleados');
        }
    }
    setDefaultDateRange() {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        ['asistencia-fecha-inicio', 'puntualidad-fecha-inicio'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                el.value = weekAgo;
        });
        ['asistencia-fecha-fin', 'puntualidad-fecha-fin'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                el.value = today;
        });
    }
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
