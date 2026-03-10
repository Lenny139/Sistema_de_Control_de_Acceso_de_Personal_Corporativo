import { Empleado } from '../models/Empleado.model';
import { EstadoEdificio } from '../models/RegistroAcceso.model';

export class RRHHView {
  public render(): void {
    this.bindSidebarNavigation();
    this.bindEmpleadoRealtimeValidation();
  }

  public renderDashboardCards(estado: EstadoEdificio): void {
    this.setText('card-presentes-hoy', String(estado.presentes.length));
    this.setText('card-visitantes-hoy', String(estado.visitantesPresentes.length));
  }

  public renderEmpleadosTable(empleados: Empleado[]): void {
    this.setText('card-total-empleados', String(empleados.filter((x) => x.activo).length));
    const body = document.getElementById('empleados-table-body');
    if (!body) {
      return;
    }

    body.innerHTML = empleados
      .map(
        (empleado) => `
          <tr>
            <td>${empleado.codigoEmpleado}</td>
            <td>${empleado.nombre} ${empleado.apellido}</td>
            <td>${empleado.departamento}</td>
            <td>${empleado.cargo}</td>
            <td>09:00-17:00</td>
            <td><span class="badge ${empleado.activo ? 'text-bg-success' : 'text-bg-secondary'}">${empleado.activo ? 'activo' : 'inactivo'}</span></td>
            <td>
              <button class="btn btn-outline-primary btn-sm">Editar</button>
              <button class="btn btn-outline-danger btn-sm">Desactivar</button>
            </td>
          </tr>
        `,
      )
      .join('');
  }

  public renderReporteAsistencia(rows: unknown[]): void {
    const body = document.getElementById('tabla-asistencia-body');
    const totals = document.getElementById('totales-asistencia');
    if (!body || !totals) {
      return;
    }

    body.innerHTML = rows
      .map((row) => {
        const item = row as Record<string, unknown>;
        return `
          <tr>
            <td>${String(item.empleado ?? '')}</td>
            <td>${String(item.fecha ?? '')}</td>
            <td>${String(item.horaEntrada ?? '')}</td>
            <td>${String(item.horaSalida ?? '')}</td>
            <td>${String(item.horasTrabajadas ?? '')}</td>
          </tr>
        `;
      })
      .join('');

    totals.textContent = `Registros: ${rows.length} · promedio de horas y días presentes calculados en reporte`;
  }

  public renderReportePuntualidad(rows: unknown[]): void {
    const body = document.getElementById('tabla-puntualidad-body');
    const resumen = document.getElementById('resumen-puntualidad');
    if (!body || !resumen) {
      return;
    }

    body.innerHTML = rows
      .map((row) => {
        const item = row as Record<string, unknown>;
        const estado = String(item.estado ?? '');
        const badgeClass =
          estado === 'PUNTUAL' ? 'text-bg-success' : estado === 'TARDANZA' ? 'text-bg-warning' : 'text-bg-danger';

        return `
          <tr>
            <td>${String(item.empleado ?? '')}</td>
            <td>${String(item.fecha ?? '')}</td>
            <td>${String(item.horaEntrada ?? '')}</td>
            <td>${String(item.horaLaboral ?? '')}</td>
            <td><span class="badge ${badgeClass}">${estado}</span></td>
            <td>${String(item.minutosRetraso ?? '')}</td>
          </tr>
        `;
      })
      .join('');

    const tardanzas = rows.filter((row) => (row as Record<string, unknown>).estado === 'TARDANZA').length;
    const ausencias = rows.filter((row) => (row as Record<string, unknown>).estado === 'AUSENTE').length;
    resumen.textContent = `${tardanzas} tardanzas, ${ausencias} ausencias en el período`;
    this.setText('card-tardanzas-hoy', String(tardanzas));
  }

  public renderEstadoEdificio(estado: EstadoEdificio): void {
    this.setText('rrhh-total-presentes', `Personas en instalaciones: ${estado.totalPresentes}`);
    const list = document.getElementById('rrhh-lista-presentes');
    if (!list) {
      return;
    }

    list.innerHTML = estado.presentes
      .map(
        (item) =>
          `<li class="list-group-item d-flex justify-content-between"><span>${item.nombre}</span><span>${item.departamento} · ${item.horaIngreso}</span></li>`,
      )
      .join('');
  }

  public showSuccess(message: string): void {
    window.alert(message);
  }

  public showError(message: string): void {
    window.alert(message);
  }

  private bindSidebarNavigation(): void {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-section]'));
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;
        if (!section) {
          return;
        }

        document.querySelectorAll<HTMLElement>('.rrhh-section').forEach((node) => node.classList.add('d-none'));
        document.getElementById(`section-${section}`)?.classList.remove('d-none');
      });
    });
  }

  private bindEmpleadoRealtimeValidation(): void {
    const fields = Array.from(
      document.querySelectorAll<HTMLInputElement>('#empleado-form input[required]'),
    );

    fields.forEach((field) => {
      field.addEventListener('input', () => {
        const isValid = field.value.trim().length > 0;
        field.classList.toggle('is-invalid', !isValid);
        field.classList.toggle('is-valid', isValid);
      });
    });
  }

  private setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }
}
