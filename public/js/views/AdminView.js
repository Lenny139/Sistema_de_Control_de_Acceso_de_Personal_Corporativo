export class AdminView {
    constructor() {
        this.empleadosData = [];
        this.empleadoModalInstance = null;
        this.usuarioModalInstance = null;
        this.checkpointModalInstance = null;
    }
    render() {
        this.bindSidebarNavigation();
        this.bindEmpleadoActions();
        this.bindEmpleadoFilters();
        this.bindUsuarioActions();
        this.bindCheckpointActions();
        this.bindAuditoriaActions();
    }
    bindLoadUsuarios(fn) {
        this.onLoadUsuarios = fn;
    }
    bindLoadCheckpoints(fn) {
        this.onLoadCheckpoints = fn;
    }
    bindLoadAuditoria(fn) {
        this.onLoadAuditoria = fn;
    }
    bindLoadEmpleados(fn) {
        this.onLoadEmpleados = fn;
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
    bindCreateUsuario(fn) {
        this.onCreateUsuario = fn;
    }
    bindDeactivateUsuario(fn) {
        this.onDeactivateUsuario = fn;
    }
    bindCreateCheckpoint(fn) {
        this.onCreateCheckpoint = fn;
    }
    bindDeleteCheckpoint(fn) {
        this.onDeleteCheckpoint = fn;
    }
    renderUsuarios(users) {
        const body = document.getElementById('admin-usuarios-body');
        if (!body) {
            return;
        }
        body.innerHTML = users
            .map((user) => {
            const roleBadge = this.getRoleBadgeClass(user.role);
            return `
          <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td><span class="badge ${roleBadge}">${user.role}</span></td>
            <td><span class="badge ${user.activo ? 'text-bg-success' : 'text-bg-secondary'}">${user.activo ? 'activo' : 'inactivo'}</span></td>
            <td>
              <button class="btn btn-outline-danger btn-sm" data-user-id="${user.id}" ${user.activo ? '' : 'disabled'}>Desactivar</button>
            </td>
          </tr>
        `;
        })
            .join('');
    }
    renderCheckpoints(checkpoints) {
        const body = document.getElementById('admin-checkpoints-body');
        if (!body) {
            return;
        }
        body.innerHTML = checkpoints
            .map((checkpoint) => `
          <tr>
            <td>${checkpoint.nombre}</td>
            <td>${checkpoint.descripcion ?? ''}</td>
            <td><span class="badge ${checkpoint.activo ? 'text-bg-success' : 'text-bg-secondary'}">${checkpoint.activo ? 'activo' : 'inactivo'}</span></td>
            <td>
              <button class="btn btn-outline-danger btn-sm" data-cp-id="${checkpoint.id}">Eliminar</button>
            </td>
          </tr>
        `)
            .join('');
    }
    renderEmpleadosTable(empleados) {
        this.empleadosData = empleados;
        this.setText('admin-card-empleados', String(empleados.filter((x) => x.activo).length));
        this.fillDepartamentoFilter(empleados);
        this.renderEmpleadosRows(empleados);
    }
    renderAuditoria(logs) {
        const body = document.getElementById('admin-auditoria-body');
        if (!body) {
            return;
        }
        body.innerHTML = logs
            .map((log) => {
            const fecha = new Date(log.timestamp).toLocaleString('es-CO');
            const badge = this.getAccionBadgeClass(log.accion);
            return `
          <tr>
            <td>${fecha}</td>
            <td>${log.usuarioUsername ?? log.usuarioId ?? ''}</td>
            <td><span class="badge ${badge}">${log.accion}</span></td>
            <td>${log.entidad}</td>
            <td>${log.entidadId ?? ''}</td>
            <td>${log.ipAddress ?? ''}</td>
          </tr>
        `;
        })
            .join('');
    }
    renderEstadoEdificio(estado) {
        const totalNode = document.getElementById('admin-total-presentes');
        const listNode = document.getElementById('admin-lista-presentes');
        if (!totalNode || !listNode) {
            return;
        }
        totalNode.textContent = `Personas en instalaciones: ${estado.totalPresentes}`;
        listNode.innerHTML = estado.presentes
            .map((item) => `<li class="list-group-item d-flex justify-content-between"><span>${item.nombre}</span><span>${item.departamento} · ${item.horaIngreso}</span></li>`)
            .join('');
    }
    openUsuarioModal() {
        const modal = this.getUsuarioModalInstance();
        if (modal) {
            modal.show();
        }
    }
    closeUsuarioModal() {
        const modal = this.getUsuarioModalInstance();
        if (modal) {
            modal.hide();
        }
        this.setInputValue('admin-form-username', '');
        this.setInputValue('admin-form-email', '');
        this.setInputValue('admin-form-password', '');
        this.setInputValue('admin-form-role', '');
        const errorNode = document.getElementById('admin-usuario-error');
        if (errorNode) {
            errorNode.classList.add('d-none');
            errorNode.textContent = '';
        }
    }
    openCheckpointModal() {
        const modal = this.getCheckpointModalInstance();
        if (modal) {
            modal.show();
        }
    }
    closeCheckpointModal() {
        const modal = this.getCheckpointModalInstance();
        if (modal) {
            modal.hide();
        }
        this.setInputValue('admin-form-cp-nombre', '');
        this.setInputValue('admin-form-cp-descripcion', '');
        const errorNode = document.getElementById('admin-checkpoint-error');
        if (errorNode) {
            errorNode.classList.add('d-none');
            errorNode.textContent = '';
        }
    }
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    showError(message) {
        this.showToast(message, 'danger');
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
                document.querySelectorAll('.admin-section').forEach((node) => node.classList.add('d-none'));
                document.getElementById(`admin-section-${section}`)?.classList.remove('d-none');
                if (section === 'empleados' && this.isEmptyTable('admin-empleados-table-body')) {
                    this.onLoadEmpleados?.();
                }
                if (section === 'usuarios' && this.isEmptyTable('admin-usuarios-body')) {
                    this.onLoadUsuarios?.();
                }
                if (section === 'checkpoints' && this.isEmptyTable('admin-checkpoints-body')) {
                    this.onLoadCheckpoints?.();
                }
                if (section === 'auditoria' && this.isEmptyTable('admin-auditoria-body')) {
                    this.onLoadAuditoria?.(this.getAuditFiltros());
                }
            });
        });
    }
    bindUsuarioActions() {
        const nuevoUsuarioBtn = document.getElementById('btn-nuevo-usuario');
        const crearUsuarioBtn = document.getElementById('btn-crear-usuario');
        const usuariosBody = document.getElementById('admin-usuarios-body');
        nuevoUsuarioBtn?.addEventListener('click', () => this.openUsuarioModal());
        crearUsuarioBtn?.addEventListener('click', () => {
            const payload = this.getUsuarioPayload();
            if (!payload) {
                this.showError('Completa los campos requeridos');
                return;
            }
            this.onCreateUsuario?.(payload);
        });
        usuariosBody?.addEventListener('click', (event) => {
            const target = event.target.closest('[data-user-id]');
            if (!target) {
                return;
            }
            const userId = target.dataset.userId ?? '';
            if (!userId) {
                return;
            }
            this.onDeactivateUsuario?.(userId);
        });
    }
    bindEmpleadoActions() {
        const nuevoEmpleadoBtn = document.getElementById('admin-btn-nuevo-empleado');
        const guardarEmpleadoBtn = document.getElementById('admin-btn-guardar-empleado');
        const tableBody = document.getElementById('admin-empleados-table-body');
        nuevoEmpleadoBtn?.addEventListener('click', () => this.openEmpleadoModal());
        guardarEmpleadoBtn?.addEventListener('click', () => {
            const payload = this.getEmpleadoFormPayload();
            if (!payload) {
                this.showError('Completa los campos requeridos del empleado');
                return;
            }
            const idInput = document.getElementById('admin-form-emp-id');
            const id = idInput?.value.trim() || undefined;
            this.onSaveEmpleado?.(payload, id);
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
    bindEmpleadoFilters() {
        const searchInput = document.getElementById('admin-empleado-search');
        const departamentoSelect = document.getElementById('admin-filtro-departamento');
        const estadoSelect = document.getElementById('admin-filtro-estado');
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
    bindCheckpointActions() {
        const nuevoCheckpointBtn = document.getElementById('btn-nuevo-checkpoint');
        const crearCheckpointBtn = document.getElementById('btn-crear-checkpoint');
        const checkpointsBody = document.getElementById('admin-checkpoints-body');
        nuevoCheckpointBtn?.addEventListener('click', () => this.openCheckpointModal());
        crearCheckpointBtn?.addEventListener('click', () => {
            const payload = this.getCheckpointPayload();
            if (!payload) {
                this.showError('Completa los campos requeridos');
                return;
            }
            this.onCreateCheckpoint?.(payload);
        });
        checkpointsBody?.addEventListener('click', (event) => {
            const target = event.target.closest('[data-cp-id]');
            if (!target) {
                return;
            }
            const cpId = target.dataset.cpId ?? '';
            if (!cpId) {
                return;
            }
            this.onDeleteCheckpoint?.(cpId);
        });
    }
    bindAuditoriaActions() {
        const filterButton = document.getElementById('btn-filtrar-auditoria');
        filterButton?.addEventListener('click', () => {
            this.onLoadAuditoria?.(this.getAuditFiltros());
        });
    }
    openEmpleadoModal(empleado) {
        const form = document.getElementById('admin-empleado-form');
        if (!form) {
            return;
        }
        let idInput = document.getElementById('admin-form-emp-id');
        if (!idInput) {
            idInput = document.createElement('input');
            idInput.type = 'hidden';
            idInput.id = 'admin-form-emp-id';
            form.appendChild(idInput);
        }
        if (empleado) {
            idInput.value = empleado.id;
            this.setInputValue('admin-form-codigo', empleado.codigoEmpleado);
            this.setInputValue('admin-form-nombre', empleado.nombre);
            this.setInputValue('admin-form-apellido', empleado.apellido);
            this.setInputValue('admin-form-departamento', empleado.departamento);
            this.setInputValue('admin-form-cargo', empleado.cargo);
            this.setInputValue('admin-form-hora-inicio', empleado.horarioLaboral?.horaInicio ?? '09:00');
            this.setInputValue('admin-form-hora-fin', empleado.horarioLaboral?.horaFin ?? '17:00');
        }
        else {
            idInput.value = '';
            form.reset();
            this.setInputValue('admin-form-hora-inicio', '09:00');
            this.setInputValue('admin-form-hora-fin', '17:00');
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
        const form = document.getElementById('admin-empleado-form');
        if (form) {
            form.reset();
        }
        const idInput = document.getElementById('admin-form-emp-id');
        if (idInput) {
            idInput.value = '';
        }
    }
    getAuditFiltros() {
        const fechaInicio = this.getInputValue('audit-fecha-inicio');
        const fechaFin = this.getInputValue('audit-fecha-fin');
        return {
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
        };
    }
    getUsuarioModalInstance() {
        if (this.usuarioModalInstance) {
            return this.usuarioModalInstance;
        }
        const modalElement = document.getElementById('usuarioModal');
        if (!modalElement) {
            return null;
        }
        const bootstrapApi = window.bootstrap;
        if (!bootstrapApi?.Modal) {
            return null;
        }
        this.usuarioModalInstance = new bootstrapApi.Modal(modalElement);
        return this.usuarioModalInstance;
    }
    getCheckpointModalInstance() {
        if (this.checkpointModalInstance) {
            return this.checkpointModalInstance;
        }
        const modalElement = document.getElementById('checkpointModal');
        if (!modalElement) {
            return null;
        }
        const bootstrapApi = window.bootstrap;
        if (!bootstrapApi?.Modal) {
            return null;
        }
        this.checkpointModalInstance = new bootstrapApi.Modal(modalElement);
        return this.checkpointModalInstance;
    }
    getEmpleadoModalInstance() {
        if (this.empleadoModalInstance) {
            return this.empleadoModalInstance;
        }
        const modalElement = document.getElementById('admin-empleado-modal');
        if (!modalElement) {
            return null;
        }
        const bootstrapApi = window.bootstrap;
        if (!bootstrapApi?.Modal) {
            return null;
        }
        this.empleadoModalInstance = new bootstrapApi.Modal(modalElement);
        return this.empleadoModalInstance;
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
        const select = document.getElementById('admin-filtro-departamento');
        if (!select) {
            return;
        }
        const currentValue = select.value;
        const departments = Array.from(new Set(empleados.map((emp) => emp.departamento))).sort();
        select.innerHTML = ['<option value="">Departamento</option>', ...departments.map((dept) => `<option value="${dept}">${dept}</option>`)].join('');
        select.value = currentValue;
    }
    renderEmpleadosRows(empleados) {
        const body = document.getElementById('admin-empleados-table-body');
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
        const codigo = this.getInputValue('admin-form-codigo');
        const nombre = this.getInputValue('admin-form-nombre');
        const apellido = this.getInputValue('admin-form-apellido');
        const departamento = this.getInputValue('admin-form-departamento');
        const cargo = this.getInputValue('admin-form-cargo');
        const horaInicioLaboral = this.getInputValue('admin-form-hora-inicio') || '09:00';
        const horaFinLaboral = this.getInputValue('admin-form-hora-fin') || '17:00';
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
    getUsuarioPayload() {
        const username = this.getInputValue('admin-form-username');
        const email = this.getInputValue('admin-form-email');
        const password = this.getInputValue('admin-form-password');
        const role = this.getInputValue('admin-form-role');
        if (!username || !email || !password || !role) {
            return null;
        }
        return {
            username,
            email,
            password,
            role: role,
        };
    }
    getCheckpointPayload() {
        const nombre = this.getInputValue('admin-form-cp-nombre');
        const descripcion = this.getInputValue('admin-form-cp-descripcion');
        if (!nombre) {
            return null;
        }
        return {
            nombre,
            descripcion: descripcion || undefined,
        };
    }
    getRoleBadgeClass(role) {
        if (role === 'ADMINISTRADOR')
            return 'text-bg-danger';
        if (role === 'GERENTE_RRHH')
            return 'text-bg-primary';
        if (role === 'GUARDIA_SEGURIDAD')
            return 'text-bg-warning';
        return 'text-bg-secondary';
    }
    getAccionBadgeClass(accion) {
        if (accion === 'LOGIN')
            return 'text-bg-info';
        if (accion === 'CHECK_IN')
            return 'text-bg-success';
        if (accion === 'CHECK_OUT')
            return 'text-bg-danger';
        if (accion === 'USER_CREATE')
            return 'text-bg-primary';
        if (accion === 'USER_DELETE')
            return 'text-bg-secondary';
        return 'text-bg-secondary';
    }
    isEmptyTable(id) {
        const body = document.getElementById(id);
        return !body || body.children.length === 0;
    }
    getInputValue(id) {
        const input = document.getElementById(id);
        return input?.value.trim() ?? '';
    }
    setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
        }
    }
    showToast(message, variant) {
        const container = document.getElementById('admin-toast-container');
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
