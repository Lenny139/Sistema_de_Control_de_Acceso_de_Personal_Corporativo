export class AdminView {
    constructor() {
        this.usuarioModalInstance = null;
        this.checkpointModalInstance = null;
    }
    render() {
        this.bindSidebarNavigation();
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
