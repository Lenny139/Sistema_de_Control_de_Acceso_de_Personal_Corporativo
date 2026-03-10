import { EstadoEdificio } from '../models/RegistroAcceso.model';

export class AdminView {
  public render(): void {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-section]'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;
        if (!section) {
          return;
        }

        document.querySelectorAll<HTMLElement>('.admin-section').forEach((node) => node.classList.add('d-none'));
        document.getElementById(`admin-section-${section}`)?.classList.remove('d-none');
      });
    });
  }

  public renderUsuarios(users: Array<{ username: string; role: string; activo: boolean }>): void {
    const body = document.getElementById('admin-usuarios-body');
    if (!body) {
      return;
    }

    body.innerHTML = users
      .map(
        (user) => `
          <tr>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td><span class="badge ${user.activo ? 'text-bg-success' : 'text-bg-secondary'}">${user.activo ? 'activo' : 'inactivo'}</span></td>
            <td><button class="btn btn-outline-primary btn-sm">Editar</button></td>
          </tr>
        `,
      )
      .join('');
  }

  public renderCheckpoints(checkpoints: Array<{ nombre: string; descripcion: string; activo: boolean }>): void {
    const body = document.getElementById('admin-checkpoints-body');
    if (!body) {
      return;
    }

    body.innerHTML = checkpoints
      .map(
        (checkpoint) => `
          <tr>
            <td>${checkpoint.nombre}</td>
            <td>${checkpoint.descripcion}</td>
            <td><span class="badge ${checkpoint.activo ? 'text-bg-success' : 'text-bg-secondary'}">${checkpoint.activo ? 'activo' : 'inactivo'}</span></td>
            <td><button class="btn btn-outline-primary btn-sm">Editar</button></td>
          </tr>
        `,
      )
      .join('');
  }

  public renderAuditoria(logs: Array<Record<string, string>>): void {
    const body = document.getElementById('admin-auditoria-body');
    if (!body) {
      return;
    }

    body.innerHTML = logs
      .map(
        (log) => `
          <tr>
            <td>${log.fecha ?? ''}</td>
            <td>${log.usuario ?? ''}</td>
            <td>${log.accion ?? ''}</td>
            <td>${log.entidad ?? ''}</td>
            <td>${log.entidadId ?? ''}</td>
            <td>${log.ip ?? ''}</td>
          </tr>
        `,
      )
      .join('');
  }

  public renderEstadoEdificio(estado: EstadoEdificio): void {
    const section = document.getElementById('admin-section-estado');
    if (!section) {
      return;
    }

    section.innerHTML = `
      <h2 class="h5">Estado del Edificio</h2>
      <p class="fw-bold">Personas en instalaciones: ${estado.totalPresentes}</p>
      <ul class="list-group">
        ${estado.presentes
          .map(
            (item) =>
              `<li class="list-group-item d-flex justify-content-between"><span>${item.nombre}</span><span>${item.departamento} · ${item.horaIngreso}</span></li>`,
          )
          .join('')}
      </ul>
    `;
  }
}
