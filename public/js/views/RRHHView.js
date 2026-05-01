export class RRHHView {
    constructor() {
        this.empleadosData = [];
        this.asistenciaData = [];
        this.puntualidadData = [];
        this.modalInstance = null;
    }
    render() {
        this.bindSidebarNavigation();
        this.bindEmpleadoRealtimeValidation();
        this.bindEmpleadoActions();
        this.bindReportActions();
        this.bindEmpleadoFilters();
    }
    renderDashboardCards(estado) {
        this.setText('card-presentes-hoy', String(estado.presentes.length));
        this.setText('card-visitantes-hoy', String(estado.visitantesPresentes.length));
    }
    renderEmpleadosTable(empleados) {
        this.empleadosData = empleados;
        this.setText('card-total-empleados', String(empleados.filter((x) => x.activo).length));
        this.fillDepartamentoFilter(empleados);
        this.renderEmpleadosRows(empleados);
    }
    renderReporteAsistencia(rows) {
        this.asistenciaData = rows;
        const body = document.getElementById('tabla-asistencia-body');
        const totals = document.getElementById('totales-asistencia');
        if (!body || !totals) {
            return;
        }
        body.innerHTML = rows
            .map((row) => {
            const item = row;
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
        totals.textContent = `Registros: ${rows.length} · promedio de horas y dias presentes calculados en reporte`;
    }
    renderReportePuntualidad(rows) {
        this.puntualidadData = rows;
        const body = document.getElementById('tabla-puntualidad-body');
        const resumen = document.getElementById('resumen-puntualidad');
        if (!body || !resumen) {
            return;
        }
        body.innerHTML = rows
            .map((row) => {
            const item = row;
            const estado = String(item.estado ?? '');
            const badgeClass = estado === 'PUNTUAL' ? 'text-bg-success' : estado === 'TARDANZA' ? 'text-bg-warning' : 'text-bg-danger';
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
        const tardanzas = rows.filter((row) => row.estado === 'TARDANZA').length;
        const ausencias = rows.filter((row) => row.estado === 'AUSENTE').length;
        resumen.textContent = `${tardanzas} tardanzas, ${ausencias} ausencias en el periodo`;
        this.setText('card-tardanzas-hoy', String(tardanzas));
    }
    renderEstadoEdificio(estado) {
        this.setText('rrhh-total-presentes', `Personas en instalaciones: ${estado.totalPresentes}`);
        const list = document.getElementById('rrhh-lista-presentes');
        if (!list) {
            return;
        }
        list.innerHTML = estado.presentes
            .map((item) => `<li class="list-group-item d-flex justify-content-between"><span>${item.nombre}</span><span>${item.departamento} · ${item.horaIngreso}</span></li>`)
            .join('');
    }
    openEmpleadoModal(empleado) {
        const form = document.getElementById('empleado-form');
        if (!form) {
            return;
        }
        let idInput = document.getElementById('form-emp-id');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.id = 'form-emp-id';
            form.appendChild(idInput);
        }
        if (empleado) {
            idInput.value = empleado.id;
            this.setInputValue('form-codigo', empleado.codigoEmpleado);
            this.setInputValue('form-nombre', empleado.nombre);
            this.setInputValue('form-apellido', empleado.apellido);
            this.setInputValue('form-departamento', empleado.departamento);
            this.setInputValue('form-cargo', empleado.cargo);
            this.setInputValue('form-hora-inicio', empleado.horarioLaboral?.horaInicio ?? '09:00');
            this.setInputValue('form-hora-fin', empleado.horarioLaboral?.horaFin ?? '17:00');
        }
        else {
            idInput.value = '';
            form.reset();
            this.setInputValue('form-hora-inicio', '09:00');
            this.setInputValue('form-hora-fin', '17:00');
        }
        const modal = this.getEmpleadoModalInstance();
        if (modal) {
            modal.show();
        }
    }
    closeEmpleadoModal() {
        const modal = this.getEmpleadoModalInstance();
        if (modal) {
            modal.hide();
        }
        const form = document.getElementById('empleado-form');
        if (form) {
            form.reset();
        }
        const idInput = document.getElementById('form-emp-id');
        if (idInput) {
            idInput.value = '';
        }
    }
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    showError(message) {
        this.showToast(message, 'danger');
    }
    bindSaveEmpleado(fn) {
        this.onSaveEmpleado = fn;
    }
    bindEditEmpleado(fn) {
        this.onEditEmpleado = fn;
    }
    bindDeactivateEmpleado(fn) {
        this.onDeactivateEmpleado = fn;
    }
    bindGenerarAsistencia(fn) {
        this.onGenerarAsistencia = fn;
    }
    bindExportarAsistencia(fn) {
        this.onExportarAsistencia = fn;
    }
    bindGenerarPuntualidad(fn) {
        this.onGenerarPuntualidad = fn;
    }
    bindExportarPuntualidad(fn) {
        this.onExportarPuntualidad = fn;
    }
    bindSidebarNavigation() {
        const buttons = Array.from(document.querySelectorAll('[data-section]'));
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const section = button.dataset.section;
                if (!section) {
                    return;
                }
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                document.querySelectorAll('.rrhh-section').forEach((node) => node.classList.add('d-none'));
                document.getElementById(`section-${section}`)?.classList.remove('d-none');
            });
        });
    }
    bindEmpleadoRealtimeValidation() {
        const fields = Array.from(document.querySelectorAll('#empleado-form input[required]'));
        fields.forEach((field) => {
            field.addEventListener('input', () => {
                const isValid = field.value.trim().length > 0;
                field.classList.toggle('is-invalid', !isValid);
                field.classList.toggle('is-valid', isValid);
            });
        });
    }
    bindEmpleadoActions() {
        const nuevoEmpleadoBtn = document.getElementById('btn-nuevo-empleado');
        const guardarEmpleadoBtn = document.getElementById('btn-guardar-empleado');
        const tableBody = document.getElementById('empleados-table-body');
        nuevoEmpleadoBtn?.addEventListener('click', () => this.openEmpleadoModal());
        guardarEmpleadoBtn?.addEventListener('click', () => {
            const payload = this.getEmpleadoFormPayload();
            if (!payload) {
                this.showError('Completa los campos requeridos del empleado');
                return;
            }
            const idInput = document.getElementById('form-emp-id');
            const id = idInput?.value.trim() || undefined;
            void this.onSaveEmpleado?.(payload, id);
        });
        tableBody?.addEventListener('click', (event) => {
            const target = event.target.closest('[data-action][data-emp-id]');
            if (!target) {
                return;
            }
            const action = target.dataset.action;
            const empId = target.dataset.empId ?? '';
            if (!empId) {
                return;
            }
            if (action === 'edit') {
                this.onEditEmpleado?.(empId);
            }
            if (action === 'deactivate') {
                void this.onDeactivateEmpleado?.(empId);
            }
        });
    }
    bindReportActions() {
        const btnGenerarAsistencia = document.getElementById('btn-generar-asistencia');
        const btnExportarAsistencia = document.getElementById('btn-exportar-asistencia');
        const btnGenerarPuntualidad = document.getElementById('btn-generar-puntualidad');
        const btnExportarPuntualidad = document.getElementById('btn-exportar-puntualidad');
        btnGenerarAsistencia?.addEventListener('click', () => {
            void this.onGenerarAsistencia?.(this.getReporteParams('asistencia'));
        });
        btnExportarAsistencia?.addEventListener('click', () => {
            void this.onExportarAsistencia?.();
        });
        btnGenerarPuntualidad?.addEventListener('click', () => {
            void this.onGenerarPuntualidad?.(this.getReporteParams('puntualidad'));
        });
        btnExportarPuntualidad?.addEventListener('click', () => {
            void this.onExportarPuntualidad?.();
        });
    }
    bindEmpleadoFilters() {
        const searchInput = document.getElementById('empleado-search');
        const departamentoSelect = document.getElementById('filtro-departamento');
        const estadoSelect = document.getElementById('filtro-estado');
        let debounceTimer = null;
        searchInput?.addEventListener('input', () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            debounceTimer = setTimeout(() => {
                this.filterEmpleados(searchInput.value, departamentoSelect?.value, estadoSelect?.value);
            }, 300);
        });
        departamentoSelect?.addEventListener('change', () => {
            this.filterEmpleados(searchInput?.value ?? '', departamentoSelect.value, estadoSelect?.value);
        });
        estadoSelect?.addEventListener('change', () => {
            this.filterEmpleados(searchInput?.value ?? '', departamentoSelect?.value, estadoSelect.value);
        });
    }
    filterEmpleados(query, departamento, estado) {
        const normalizedQuery = (query ?? '').trim().toLowerCase();
        const normalizedDepartamento = (departamento ?? '').trim().toLowerCase();
        const normalizedEstado = (estado ?? '').trim().toLowerCase();
        const filtered = this.empleadosData.filter((emp) => {
            const matchesQuery = !normalizedQuery
                ? true
                : [emp.codigoEmpleado, emp.nombre, emp.apellido].some((value) => value.toLowerCase().includes(normalizedQuery));
            const matchesDepartamento = !normalizedDepartamento
                ? true
                : emp.departamento.toLowerCase() === normalizedDepartamento;
            const matchesEstado = !normalizedEstado
                ? true
                : normalizedEstado === 'activo'
                    ? emp.activo
                    : !emp.activo;
            return matchesQuery && matchesDepartamento && matchesEstado;
        });
        this.renderEmpleadosRows(filtered);
    }
    fillDepartamentoFilter(empleados) {
        const select = document.getElementById('filtro-departamento');
        if (!select) {
            return;
        }
        const currentValue = select.value;
        const departments = Array.from(new Set(empleados.map((emp) => emp.departamento))).sort();
        select.innerHTML = ['<option value="">Departamento</option>', ...departments.map((dept) => `<option value="${dept}">${dept}</option>`)].join('');
        select.value = currentValue;
    }
    renderEmpleadosRows(empleados) {
        const body = document.getElementById('empleados-table-body');
        if (!body) {
            return;
        }
        body.innerHTML = empleados
            .map((empleado) => {
            const horarioInicio = empleado.horarioLaboral?.horaInicio ?? '09:00';
            const horarioFin = empleado.horarioLaboral?.horaFin ?? '17:00';
            return `
          <tr>
            <td>${empleado.codigoEmpleado}</td>
            <td>${empleado.nombre} ${empleado.apellido}</td>
            <td>${empleado.departamento}</td>
            <td>${empleado.cargo}</td>
            <td>${horarioInicio}-${horarioFin}</td>
            <td><span class="badge ${empleado.activo ? 'text-bg-success' : 'text-bg-secondary'}">${empleado.activo ? 'activo' : 'inactivo'}</span></td>
            <td>
              <button class="btn btn-outline-primary btn-sm" data-action="edit" data-emp-id="${empleado.id}">Editar</button>
              <button class="btn btn-outline-danger btn-sm" data-action="deactivate" data-emp-id="${empleado.id}" ${!empleado.activo ? 'disabled' : ''}>Desactivar</button>
            </td>
          </tr>
        `;
        })
            .join('');
    }
    getEmpleadoFormPayload() {
        const codigo = this.getInputValue('form-codigo');
        const nombre = this.getInputValue('form-nombre');
        const apellido = this.getInputValue('form-apellido');
        const departamento = this.getInputValue('form-departamento');
        const cargo = this.getInputValue('form-cargo');
        const horaInicioLaboral = this.getInputValue('form-hora-inicio') || '09:00';
        const horaFinLaboral = this.getInputValue('form-hora-fin') || '17:00';
        if (!codigo || !nombre || !apellido || !departamento || !cargo) {
            return null;
        }
        return {
            codigoEmpleado: codigo,
            nombre,
            apellido,
            departamento,
            cargo,
            horaInicioLaboral,
            horaFinLaboral,
        };
    }
    getReporteParams(prefix) {
        const empleado = this.getInputValue(`${prefix}-empleado`);
        const departamento = this.getInputValue(`${prefix}-departamento`);
        const fechaInicio = this.getInputValue(`${prefix}-fecha-inicio`);
        const fechaFin = this.getInputValue(`${prefix}-fecha-fin`);
        return {
            empleado: empleado || undefined,
            departamento: departamento || undefined,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
        };
    }
    getEmpleadoModalInstance() {
        if (this.modalInstance) {
            return this.modalInstance;
        }
        const modalElement = document.getElementById('empleadoModal');
        if (!modalElement) {
            return null;
        }
        const bootstrapApi = window.bootstrap;
        if (!bootstrapApi?.Modal) {
            return null;
        }
        this.modalInstance = new bootstrapApi.Modal(modalElement);
        return this.modalInstance;
    }
    setText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
        }
    }
    getInputValue(id) {
        const input = document.getElementById(id);
        return input?.value.trim() ?? '';
    }
    showToast(message, variant) {
        const container = document.getElementById('rrhh-toast-container');
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
        }, 4000);
    }
}
