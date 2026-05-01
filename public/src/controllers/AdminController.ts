import { AdminView } from '../views/AdminView.js';
import { EstadoEdificioService } from '../services/EstadoEdificioService.js';
import { AdminUsuarioService, CreateUsuarioDto } from '../services/AdminUsuarioService.js';
import { CheckpointService } from '../services/CheckpointService.js';
import { AuditLogService } from '../services/AuditLogService.js';
import { EstadoEdificio } from '../models/RegistroAcceso.model.js';

export class AdminController {
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();
  private readonly usuarioService = new AdminUsuarioService();
  private readonly checkpointService = new CheckpointService();
  private readonly auditService = new AuditLogService();

  constructor(private readonly view: AdminView) {
    this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
  }

  public init(): void {
    this.view.render();
    this.bindViewCallbacks();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
  }

  private bindViewCallbacks(): void {
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

  public async loadUsuarios(): Promise<void> {
    try {
      const usuarios = await this.usuarioService.getAll();
      this.view.renderUsuarios(usuarios);
    } catch {
      this.view.showError('Error al cargar usuarios');
    }
  }

  public async loadCheckpoints(): Promise<void> {
    try {
      const checkpoints = await this.checkpointService.getAll();
      this.view.renderCheckpoints(checkpoints);
    } catch {
      this.view.showError('Error al cargar puntos de control');
    }
  }

  public async loadAuditoria(filtros?: { fechaInicio?: string; fechaFin?: string }): Promise<void> {
    try {
      const logs = await this.auditService.getLogs({ ...filtros, limit: 100 });
      this.view.renderAuditoria(logs);
    } catch {
      this.view.showError('Error al cargar el log de auditoria');
    }
  }

  private async createUsuario(dto: CreateUsuarioDto): Promise<void> {
    try {
      await this.usuarioService.create(dto);
      this.view.showSuccess('Usuario creado correctamente');
      this.view.closeUsuarioModal();
      await this.loadUsuarios();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error al crear usuario');
    }
  }

  private async deactivateUsuario(id: string): Promise<void> {
    if (!window.confirm('¿Desactivar este usuario?')) return;
    try {
      await this.usuarioService.deactivate(id);
      this.view.showSuccess('Usuario desactivado');
      await this.loadUsuarios();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error');
    }
  }

  private async createCheckpoint(data: { nombre: string; descripcion?: string }): Promise<void> {
    try {
      await this.checkpointService.create(data);
      this.view.showSuccess('Punto de control creado');
      this.view.closeCheckpointModal();
      await this.loadCheckpoints();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error');
    }
  }

  private async deleteCheckpoint(id: string): Promise<void> {
    if (!window.confirm('¿Eliminar este punto de control?')) return;
    try {
      await this.checkpointService.delete(id);
      this.view.showSuccess('Punto de control eliminado');
      await this.loadCheckpoints();
    } catch (error) {
      this.view.showError(error instanceof Error ? error.message : 'Error');
    }
  }

  private readonly onEstadoEdificioChanged = (estado: EstadoEdificio): void => {
    this.view.renderEstadoEdificio(estado);
  };

  public destroy(): void {
    this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
    this.estadoEdificioService.stopAutoRefresh();
  }
}