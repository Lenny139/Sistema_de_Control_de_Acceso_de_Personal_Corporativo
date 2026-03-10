import { Empleado } from '../models/Empleado.model';
import { EstadoEdificio } from '../models/RegistroAcceso.model';

export class GuardiaView {
  public render(): void {}

  public renderEmpleadoBuscado(empleado: Empleado, estaPresente: boolean): void {
    const card = document.getElementById('selected-employee-card');
    const name = document.getElementById('selected-employee-name');
    const department = document.getElementById('selected-employee-department');
    const status = document.getElementById('selected-employee-status');
    const btnCheckIn = document.getElementById('btn-checkin');
    const btnCheckOut = document.getElementById('btn-checkout');

    if (!card || !name || !department || !status || !btnCheckIn || !btnCheckOut) {
      return;
    }

    card.classList.remove('d-none');
    name.textContent = `${empleado.nombre} ${empleado.apellido}`;
    department.textContent = empleado.departamento;
    status.textContent = estaPresente ? 'PRESENTE' : 'AUSENTE';
    status.className = `badge ${estaPresente ? 'text-bg-success' : 'text-bg-secondary'}`;

    if (estaPresente) {
      btnCheckIn.classList.add('d-none');
      btnCheckOut.classList.remove('d-none');
    } else {
      btnCheckOut.classList.add('d-none');
      btnCheckIn.classList.remove('d-none');
    }
  }

  public renderDashboardPresentes(estado: EstadoEdificio): void {
    const totalTitle = document.getElementById('total-personas-title');
    const lastUpdate = document.getElementById('last-update-text');
    const empleadosList = document.getElementById('empleados-presentes-list');
    const visitantesList = document.getElementById('visitantes-dashboard-list');
    const visitantesPresentesList = document.getElementById('visitantes-presentes-list');

    if (!totalTitle || !lastUpdate || !empleadosList || !visitantesList || !visitantesPresentesList) {
      return;
    }

    totalTitle.textContent = `Personas en las instalaciones: ${estado.totalPresentes}`;

    if (estado.lastUpdate) {
      const seconds = Math.max(0, Math.floor((Date.now() - estado.lastUpdate.getTime()) / 1000));
      lastUpdate.textContent = `Actualizado hace ${seconds} segundos`;
    }

    empleadosList.innerHTML = estado.presentes
      .map((item) => {
        const showAlert = item.minutosEnInstalaciones > 600;
        const alertBadge = showAlert ? '<span class="badge text-bg-warning ms-2">+10 horas</span>' : '';

        return `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>${item.nombre}</strong>
              <div class="small text-muted">${item.departamento}</div>
              <div class="small">Ingreso: ${item.horaIngreso} · Hace ${item.minutosEnInstalaciones} min</div>
            </div>
            ${alertBadge}
          </li>
        `;
      })
      .join('');

    visitantesList.innerHTML = estado.visitantesPresentes
      .map(
        (visitante) => `
          <li class="list-group-item">
            <strong>${visitante.nombre} ${visitante.apellido}</strong>
            <div class="small text-muted">Anfitrión: ${visitante.empleadoAnfitrionId}</div>
            <div class="small">Ingreso: ${visitante.horaEntrada}</div>
          </li>
        `,
      )
      .join('');

    visitantesPresentesList.innerHTML = estado.visitantesPresentes
      .map(
        (visitante) => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${visitante.nombre} ${visitante.apellido}</span>
            <button class="btn btn-outline-danger btn-sm" data-visitante-id="${visitante.id}">Registrar Salida</button>
          </li>
        `,
      )
      .join('');
  }

  public showSuccess(mensaje: string): void {
    const feedback = document.getElementById('guardia-feedback');
    if (feedback) {
      feedback.className = 'alert alert-success';
      feedback.textContent = mensaje;
    }

    this.showToast(mensaje, 'success');
  }

  public showError(mensaje: string): void {
    const feedback = document.getElementById('guardia-feedback');
    if (feedback) {
      feedback.className = 'alert alert-danger';
      feedback.textContent = mensaje;
    }

    this.showToast(mensaje, 'danger');
  }

  public showLoading(elemento: HTMLElement): void {
    elemento.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  }

  private showToast(message: string, variant: 'success' | 'danger'): void {
    const container = document.getElementById('guardia-toast-container');
    if (!container) {
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${variant} border-0 show mb-2`;
    toast.role = 'alert';
    toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div></div>`;
    container.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
