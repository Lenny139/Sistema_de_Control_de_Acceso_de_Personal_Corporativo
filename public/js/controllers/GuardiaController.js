import { AccessRecordService } from '../services/AccessRecordService.js';
import { CheckpointService } from '../services/CheckpointService.js';
import { EmpleadoService } from '../services/EmpleadoService.js';
import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { VisitanteService } from '../services/VisitanteService.js';
export class GuardiaController {
    constructor(view) {
        this.view = view;
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.empleadoService = new EmpleadoService();
        this.accessRecordService = new AccessRecordService();
        this.checkpointService = new CheckpointService();
        this.visitanteService = new VisitanteService();
        this.currentEmpleadoId = null;
        this.lastSearchResults = [];
        this.onEstadoChange = (estado) => {
            this.view.renderDashboardPresentes(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoChange);
    }
    init() {
        this.view.bindSearch((query) => this.onEmpleadoSearch(query));
        this.view.bindSelect((empleadoId, nombre) => void this.onEmpleadoSelect(empleadoId, nombre));
        this.view.bindCheckIn((empleadoId, puntoControlId, observaciones) => this.onCheckIn(empleadoId, puntoControlId, observaciones));
        this.view.bindCheckOut((empleadoId, puntoControlId) => this.onCheckOut(empleadoId, puntoControlId));
        this.view.bindRegistrarVisitante((payload) => this.onRegistrarVisitante(payload));
        this.view.bindSalidaVisitante((visitanteId) => this.onSalidaVisitante(visitanteId));
        this.view.bindRefresh(() => this.estadoEdificioService.refresh());
        this.view.render();
        void this.loadCheckpoints();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
    }
    async onEmpleadoSearch(query) {
        try {
            const results = await this.empleadoService.search(query.trim());
            this.view.renderSearchResults(results);
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo buscar el empleado');
        }
    }
    async onEmpleadoSelect(empleadoId, nombre) {
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
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo cargar el empleado');
        }
    }
    async onCheckIn(empleadoId, puntoControlId, observaciones) {
        try {
            const targetEmpleadoId = this.currentEmpleadoId ?? empleadoId;
            if (!targetEmpleadoId) {
                this.view.showError('Selecciona un empleado antes de registrar la entrada');
                return;
            }
            await this.accessRecordService.checkIn(targetEmpleadoId, puntoControlId, observaciones);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Entrada registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la entrada');
        }
    }
    async onCheckOut(empleadoId, puntoControlId) {
        try {
            const targetEmpleadoId = this.currentEmpleadoId ?? empleadoId;
            if (!targetEmpleadoId) {
                this.view.showError('Selecciona un empleado antes de registrar la salida');
                return;
            }
            await this.accessRecordService.checkOut(targetEmpleadoId, puntoControlId);
            await this.estadoEdificioService.refresh();
            this.view.showSuccess('Salida registrada correctamente');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo registrar la salida');
        }
    }
    async onRegistrarVisitante(datos) {
        try {
            const payload = datos;
            await this.visitanteService.registrarEntrada(payload);
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
    async onRefresh() {
        try {
            await this.estadoEdificioService.refresh();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudo actualizar el estado');
        }
    }
    async loadCheckpoints() {
        try {
            const checkpoints = await this.checkpointService.getAll();
            const select = document.getElementById('checkpoint-select');
            if (!select) {
                return;
            }
            select.innerHTML = [
                '<option value="">Seleccionar punto de control</option>',
                ...checkpoints.map((cp) => `<option value="${cp.id}">${cp.nombre}</option>`),
            ].join('');
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'No se pudieron cargar los puntos de control');
        }
    }
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoChange);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
