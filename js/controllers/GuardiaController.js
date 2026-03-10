import { AccessRecordService } from '../services/AccessRecordService';
import { EmpleadoService } from '../services/EmpleadoService';
import { EstadoEdificioService } from '../services/EstadoEdificioService';
import { VisitanteService } from '../services/VisitanteService';
export class GuardiaController {
    constructor(view) {
        this.view = view;
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.empleadoService = new EmpleadoService();
        this.accessRecordService = new AccessRecordService();
        this.visitanteService = new VisitanteService();
        this.onEstadoChange = (estado) => {
            this.view.renderDashboardPresentes(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoChange);
    }
    init() {
        this.view.render();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
    }
    async onEmpleadoSearch(query) {
        if (query.trim().length < 3) {
            return [];
        }
        return this.empleadoService.search(query.trim());
    }
    onEmpleadoSelect(empleado) {
        const estaPresente = this.estadoEdificioService
            .getPresentes()
            .some((presencia) => presencia.empleadoId === empleado.id);
        this.view.renderEmpleadoBuscado(empleado, estaPresente);
    }
    async onCheckIn(empleadoId, puntoControlId, observaciones) {
        try {
            await this.accessRecordService.checkIn(empleadoId, puntoControlId, observaciones);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Entrada registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la entrada');
        }
    }
    async onCheckOut(empleadoId, puntoControlId) {
        try {
            await this.accessRecordService.checkOut(empleadoId, puntoControlId);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Salida registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
        }
    }
    async onRegistrarVisitante(datos) {
        try {
            await this.visitanteService.registrarEntrada(datos);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Entrada de visitante registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar el visitante');
        }
    }
    async onSalidaVisitante(visitanteId) {
        try {
            await this.visitanteService.registrarSalida(visitanteId);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Salida de visitante registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
        }
    }
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoChange);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
