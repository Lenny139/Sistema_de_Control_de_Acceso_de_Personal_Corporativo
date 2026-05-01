import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { AdminUsuarioService } from '../services/AdminUsuarioService.js';
import { CheckpointService } from '../services/CheckpointService.js';
import { AuditLogService } from '../services/AuditLogService.js';
export class AdminController {
    constructor(view) {
        this.view = view;
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.usuarioService = new AdminUsuarioService();
        this.checkpointService = new CheckpointService();
        this.auditService = new AuditLogService();
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
    }
    bindViewCallbacks() {
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
