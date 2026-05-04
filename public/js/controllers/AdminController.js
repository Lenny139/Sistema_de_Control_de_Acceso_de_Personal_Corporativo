import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { EmpleadoService } from '../services/EmpleadoService.js';
import { AdminUsuarioService } from '../services/AdminUsuarioService.js';
import { CheckpointService } from '../services/CheckpointService.js';
import { AuditLogService } from '../services/AuditLogService.js';
export class AdminController {
    constructor(view) {
        this.view = view;
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.empleadoService = new EmpleadoService();
        this.usuarioService = new AdminUsuarioService();
        this.checkpointService = new CheckpointService();
        this.auditService = new AuditLogService();
        this.asistenciaData = [];
        this.editingEmpleadoId = null;
        this.onEstadoEdificioChanged = (estado) => {
            this.view.renderEstadoEdificio(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
    }
    init() {
        this.view.render();
        this.bindViewCallbacks();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
        this.setDefaultDateRange();
    }
    bindViewCallbacks() {
        this.view.bindLoadEmpleados(() => {
            void this.loadEmpleados();
        });
        this.view.bindSaveEmpleado(async (data, id) => {
            await this.onSaveEmpleado(data, id);
        });
        this.view.bindEditEmpleado((id) => {
            this.onEditEmpleado(id);
        });
        this.view.bindDeactivateEmpleado(async (id) => {
            await this.onDeleteEmpleado(id);
        });
        this.view.bindLoadUsuarios(() => {
            void this.loadUsuarios();
        });
        this.view.bindLoadCheckpoints(() => {
            void this.loadCheckpoints();
        });
        this.view.bindLoadAuditoria((filtros) => {
            void this.loadAuditoria(filtros);
        });
        this.view.bindCreateUsuario(async (dto) => {
            await this.createUsuario(dto);
        });
        this.view.bindDeactivateUsuario(async (id) => {
            await this.deactivateUsuario(id);
        });
        this.view.bindCreateCheckpoint(async (data) => {
            await this.createCheckpoint(data);
        });
        this.view.bindDeleteCheckpoint(async (id) => {
            await this.deleteCheckpoint(id);
        });
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
    setDefaultDateRange() {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
        ['admin-asistencia-fecha-inicio', 'admin-puntualidad-fecha-inicio'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                el.value = yesterday;
        });
        ['admin-asistencia-fecha-fin', 'admin-puntualidad-fecha-fin'].forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                el.value = yesterday;
        });
    }
    async loadUsuarios() {
        try {
            const usuarios = await this.usuarioService.getAll();
            this.view.renderUsuarios(usuarios);
        }
        catch {
            this.view.showError('Error al cargar usuarios');
        }
    }
    async loadCheckpoints() {
        try {
            const checkpoints = await this.checkpointService.getAll();
            this.view.renderCheckpoints(checkpoints);
        }
        catch {
            this.view.showError('Error al cargar puntos de control');
        }
    }
    async loadAuditoria(filtros) {
        try {
            const logs = await this.auditService.getLogs({ ...filtros, limit: 100 });
            this.view.renderAuditoria(logs);
        }
        catch {
            this.view.showError('Error al cargar el log de auditoria');
        }
    }
    async createUsuario(dto) {
        try {
            await this.usuarioService.create(dto);
            this.view.showSuccess('Usuario creado correctamente');
            this.view.closeUsuarioModal();
            await this.loadUsuarios();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error al crear usuario');
        }
    }
    async deactivateUsuario(id) {
        if (!window.confirm('¿Desactivar este usuario?'))
            return;
        try {
            await this.usuarioService.deactivate(id);
            this.view.showSuccess('Usuario desactivado');
            await this.loadUsuarios();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error');
        }
    }
    async createCheckpoint(data) {
        try {
            await this.checkpointService.create(data);
            this.view.showSuccess('Punto de control creado');
            this.view.closeCheckpointModal();
            await this.loadCheckpoints();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error');
        }
    }
    async deleteCheckpoint(id) {
        if (!window.confirm('¿Eliminar este punto de control?'))
            return;
        try {
            await this.checkpointService.delete(id);
            this.view.showSuccess('Punto de control eliminado');
            await this.loadCheckpoints();
        }
        catch (error) {
            this.view.showError(error instanceof Error ? error.message : 'Error');
        }
    }
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
