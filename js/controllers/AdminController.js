import { EstadoEdificioService } from '../services/EstadoEdificioService';
export class AdminController {
    constructor(view) {
        this.view = view;
        this.estadoEdificioService = EstadoEdificioService.getInstance();
        this.onEstadoEdificioChanged = (estado) => {
            this.view.renderEstadoEdificio(estado);
        };
        this.estadoEdificioService.subscribe(this.onEstadoEdificioChanged);
    }
    init() {
        this.view.render();
        void this.estadoEdificioService.refresh();
        this.estadoEdificioService.startAutoRefresh(30);
    }
    loadUsuarios() {
        const usuarios = [
            { username: 'guardia1', role: 'GUARDIA_SEGURIDAD', activo: true },
            { username: 'gerente', role: 'GERENTE_RRHH', activo: true },
        ];
        this.view.renderUsuarios(usuarios);
    }
    loadCheckpoints() {
        const checkpoints = [
            { nombre: 'Entrada Principal', descripcion: 'Acceso peatonal', activo: true },
            { nombre: 'Entrada Parking', descripcion: 'Acceso vehicular', activo: true },
        ];
        this.view.renderCheckpoints(checkpoints);
    }
    loadAuditoria() {
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
    destroy() {
        this.estadoEdificioService.unsubscribe(this.onEstadoEdificioChanged);
        this.estadoEdificioService.stopAutoRefresh();
    }
}
