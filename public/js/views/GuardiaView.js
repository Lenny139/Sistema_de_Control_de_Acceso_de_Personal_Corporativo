export class GuardiaView {
    constructor() {
        this.selectedEmpleadoId = null;
    }
    render() {
        // 1. BIND busqueda: al escribir >= 3 chars llama onSearch, oculta si < 3
        const searchInput = document.getElementById('employee-search');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                const query = searchInput.value.trim();
                if (query.length < 3) {
                    this.clearSearchResults();
                    return;
                }
                debounceTimer = setTimeout(() => {
                    void this.onSearch?.(query);
                }, 300);
            });
            // Cierra el dropdown al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target)) {
                    this.clearSearchResults();
                }
            });
        }
        // 2. BIND check-in/check-out buttons
        const btnCheckIn = document.getElementById('btn-checkin');
        const btnCheckOut = document.getElementById('btn-checkout');
        const obsInput = document.getElementById('observaciones-input');
        const checkpointSelect = document.getElementById('checkpoint-select');
        if (btnCheckIn) {
            btnCheckIn.addEventListener('click', () => {
                if (!this.selectedEmpleadoId)
                    return;
                const puntoControlId = checkpointSelect?.value ?? '';
                if (!puntoControlId) {
                    this.showError('Selecciona un punto de control');
                    return;
                }
                void this.onCheckIn?.(this.selectedEmpleadoId, puntoControlId, obsInput?.value ?? undefined);
                if (obsInput)
                    obsInput.value = '';
            });
        }
        if (btnCheckOut) {
            btnCheckOut.addEventListener('click', () => {
                if (!this.selectedEmpleadoId)
                    return;
                const puntoControlId = checkpointSelect?.value ?? '';
                if (!puntoControlId) {
                    this.showError('Selecciona un punto de control');
                    return;
                }
                void this.onCheckOut?.(this.selectedEmpleadoId, puntoControlId);
            });
        }
        // 3. BIND formulario visitante - prevenir form submit y delegar al callback
        const visitanteForm = document.getElementById('visitante-form');
        if (visitanteForm) {
            visitanteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nombre = document.getElementById('visitante-nombre')?.value ?? '';
                const apellido = document.getElementById('visitante-apellido')?.value ?? '';
                const documento = document.getElementById('visitante-documento')?.value ?? '';
                const empresa = document.getElementById('visitante-empresa')?.value ?? '';
                const anfitrion = document.getElementById('visitante-anfitrion')?.value ?? '';
                const puntoControlId = checkpointSelect?.value ?? '';
                if (!nombre || !apellido || !documento || !anfitrion || !puntoControlId) {
                    this.showError('Completa todos los campos requeridos del visitante');
                    return;
                }
                void this.onRegistrarVisitante?.({
                    nombre,
                    apellido,
                    documentoIdentidad: documento,
                    empresa,
                    empleadoAnfitrionId: anfitrion,
                    puntoControlId,
                });
                visitanteForm.reset();
            });
        }
        // 4. BIND boton refresh
        const refreshBtn = document.getElementById('btn-refresh-dashboard') ??
            document.getElementById('btn-refresh-now');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                void this.onRefresh?.();
            });
        }
        // 5. BIND delegado para botones "Registrar Salida" de visitantes (lista dinamica)
        const visitantesPresentesList = document.getElementById('visitantes-presentes-list');
        if (visitantesPresentesList) {
            visitantesPresentesList.addEventListener('click', (e) => {
                const target = e.target;
                const btn = target.closest('[data-visitante-id]');
                if (btn?.dataset.visitanteId) {
                    void this.onSalidaVisitante?.(btn.dataset.visitanteId);
                }
            });
        }
    }
    // Metodos de binding de callbacks (el Controller los llama)
    bindSearch(fn) {
        this.onSearch = fn;
    }
    bindSelect(fn) {
        this.onSelect = fn;
    }
    bindCheckIn(fn) {
        this.onCheckIn = fn;
    }
    bindCheckOut(fn) {
        this.onCheckOut = fn;
    }
    bindRegistrarVisitante(fn) {
        this.onRegistrarVisitante = fn;
    }
    bindSalidaVisitante(fn) {
        this.onSalidaVisitante = fn;
    }
    bindRefresh(fn) {
        this.onRefresh = fn;
    }
    // renderSearchResults: muestra el dropdown con los resultados
    renderSearchResults(empleados) {
        const container = document.getElementById('employee-search-results');
        if (!container)
            return;
        if (!empleados.length) {
            container.innerHTML = '<div class="list-group-item text-muted">Sin resultados</div>';
            return;
        }
        container.innerHTML = empleados
            .map((emp) => `
      <button type="button"
        class="list-group-item list-group-item-action"
        data-emp-id="${emp.id}"
        data-emp-name="${emp.nombre} ${emp.apellido}">
        <strong>${emp.codigoEmpleado}</strong> - ${emp.nombre} ${emp.apellido}
        <span class="text-muted small ms-2">${emp.departamento}</span>
      </button>
    `)
            .join('');
        // Bind click en cada resultado
        container.querySelectorAll('[data-emp-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const searchInput = document.getElementById('employee-search');
                if (searchInput)
                    searchInput.value = btn.dataset.empName ?? '';
                this.clearSearchResults();
                this.onSelect?.(btn.dataset.empId ?? '', btn.dataset.empName ?? '');
            });
        });
    }
    clearSearchResults() {
        const container = document.getElementById('employee-search-results');
        if (container)
            container.innerHTML = '';
    }
    // renderEmpleadoBuscado: muestra la tarjeta del empleado seleccionado
    renderEmpleadoBuscado(empleado, estaPresente) {
        this.selectedEmpleadoId = empleado.id;
        const card = document.getElementById('selected-employee-card');
        const name = document.getElementById('selected-employee-name');
        const dept = document.getElementById('selected-employee-department');
        const status = document.getElementById('selected-employee-status');
        const btnIn = document.getElementById('btn-checkin');
        const btnOut = document.getElementById('btn-checkout');
        if (!card || !name || !dept || !status || !btnIn || !btnOut)
            return;
        card.classList.remove('d-none', 'empleado-presente', 'empleado-ausente');
        card.classList.add(estaPresente ? 'empleado-presente' : 'empleado-ausente');
        name.textContent = `${empleado.nombre} ${empleado.apellido}`;
        dept.textContent = `${empleado.departamento} - ${empleado.cargo}`;
        status.textContent = estaPresente ? 'PRESENTE' : 'AUSENTE';
        status.className = `badge ${estaPresente ? 'badge-presente' : 'badge-ausente'}`;
        btnIn.classList.toggle('d-none', estaPresente);
        btnOut.classList.toggle('d-none', !estaPresente);
    }
    // renderDashboardPresentes: actualiza la columna derecha en tiempo real
    renderDashboardPresentes(estado) {
        const totalTitle = document.getElementById('total-personas-title');
        const lastUpdate = document.getElementById('last-update-text');
        const empleadosList = document.getElementById('empleados-presentes-list');
        const visitantesDashboard = document.getElementById('visitantes-dashboard-list');
        const visitantesPresentesList = document.getElementById('visitantes-presentes-list');
        if (!totalTitle || !lastUpdate || !empleadosList || !visitantesDashboard || !visitantesPresentesList)
            return;
        totalTitle.textContent = `Personas en las instalaciones: ${estado.totalPresentes}`;
        if (estado.lastUpdate) {
            const secs = Math.max(0, Math.floor((Date.now() - estado.lastUpdate.getTime()) / 1000));
            lastUpdate.textContent =
                secs < 60
                    ? `Actualizado hace ${secs} segundos`
                    : `Actualizado hace ${Math.floor(secs / 60)} min`;
        }
        empleadosList.innerHTML =
            estado.presentes.length === 0
                ? '<li class="list-group-item text-muted small">Sin empleados presentes</li>'
                : estado.presentes
                    .map((item) => {
                    const alerta = item.minutosEnInstalaciones > 600;
                    return `
            <li class="list-group-item presentes-list-item d-flex justify-content-between align-items-start ${alerta ? 'alerta-prolongada' : ''}">
              <div>
                <div class="fw-semibold">${item.nombre}</div>
                <div class="small text-muted">${item.departamento}</div>
                <div class="small">Hora ${item.horaIngreso} · ${item.minutosEnInstalaciones} min</div>
              </div>
              ${alerta ? '<span class="badge badge-tardanza">+10h</span>' : ''}
            </li>`;
                })
                    .join('');
        visitantesDashboard.innerHTML =
            estado.visitantesPresentes.length === 0
                ? '<li class="list-group-item text-muted small">Sin visitantes</li>'
                : estado.visitantesPresentes
                    .map((v) => `
          <li class="list-group-item presentes-list-item">
            <div class="fw-semibold">${v.nombre} ${v.apellido}</div>
            <div class="small text-muted">Anfitrion ID: ${v.empleadoAnfitrionId}</div>
            <div class="small">Hora ${v.horaEntrada}</div>
          </li>`)
                    .join('');
        visitantesPresentesList.innerHTML =
            estado.visitantesPresentes.length === 0
                ? '<li class="list-group-item text-muted small">Sin visitantes presentes</li>'
                : estado.visitantesPresentes
                    .map((v) => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>${v.nombre} ${v.apellido}</span>
            <button class="btn btn-outline-danger btn-sm" data-visitante-id="${v.id}">Salida</button>
          </li>`)
                    .join('');
    }
    // Notificaciones con Toast
    showSuccess(mensaje) {
        this.showToast(mensaje, 'success');
    }
    showError(mensaje) {
        this.showToast(mensaje, 'danger');
    }
    showLoading(elemento) {
        elemento.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    }
    showToast(message, variant) {
        let container = document.getElementById('guardia-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'guardia-toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${variant} border-0 show`;
        toast.role = 'alert';
        const icon = variant === 'success' ? 'OK' : variant === 'danger' ? 'X' : '!';
        toast.innerHTML = `<div class="d-flex"><div class="toast-body">${icon} ${message}</div></div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }
}
