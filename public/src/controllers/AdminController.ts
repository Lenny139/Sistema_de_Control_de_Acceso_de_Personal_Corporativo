import { EstadoEdificio } from '../models/RegistroAcceso.model';
import { EstadoEdificioService } from '../services/EstadoEdificioService';
import { AdminView } from '../views/AdminView';

export class AdminController {
  private readonly estadoEdificioService = EstadoEdificioService.getInstance();

  constructor(private readonly view: AdminView) {
    this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
  }

  public init(): void {
    this.view.render();
    void this.estadoEdificioService.refresh();
    this.estadoEdificioService.startAutoRefresh(30);
  }

  public loadUsuarios(): void {
    const usuarios = [
      { username: 'guardia1', role: 'GUARDIA_SEGURIDAD', activo: true },
      { username: 'gerente', role: 'GERENTE_RRHH', activo: true },
    ];
    this.view.renderUsuarios(usuarios);
  }

  public loadCheckpoints(): void {
    const checkpoints = [
      { nombre: 'Entrada Principal', descripcion: 'Acceso peatonal', activo: true },
      { nombre: 'Entrada Parking', descripcion: 'Acceso vehicular', activo: true },
    ];
    this.view.renderCheckpoints(checkpoints);
  }

  public loadAuditoria(): void {
    const logs = [
      {
        fecha: new Date().toISOString(),
        usuario: 'admin',
        accion: 'LOGIN',
        entidad: 'USUARIO',
        entidadId: '-',
        ip: '127.0.0.1',
      },
    ];
    this.view.renderAuditoria(logs);
  }

  private readonly onEstadoEdificioChanged = (estado: EstadoEdificio): void => {
    this.view.renderEstadoEdificio(estado);
  };

  public destroy(): void {
    this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
    this.estadoEdificioService.stopAutoRefresh();
  }
}
