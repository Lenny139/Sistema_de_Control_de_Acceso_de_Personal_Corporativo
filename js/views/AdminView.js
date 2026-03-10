export class AdminView {
    render() {
        const buttons = Array.from(document.querySelectorAll('[data-section]'));
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const section = button.dataset.section;
                if (!section) {
                    return;
                }
                document.querySelectorAll('.admin-section').forEach((node) => node.classList.add('d-none'));
                document.getElementById(`admin-section-${section}`)?.classList.remove('d-none');
            });
        });
    }
    renderUsuarios(users) {
        const body = document.getElementById('admin-usuarios-body');
        if (!body) {
            return;
        }
        body.innerHTML = users
            .map((user) => `
          <tr>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td><span class="badge ${user.activo ? 'text-bg-success' : 'text-bg-secondary'}">${user.activo ? 'activo' : 'inactivo'}</span></td>
            <td><button class="btn btn-outline-primary btn-sm">Editar</button></td>
          </tr>
        `)
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
            <td>${checkpoint.descripcion}</td>
            <td><span class="badge ${checkpoint.activo ? 'text-bg-success' : 'text-bg-secondary'}">${checkpoint.activo ? 'activo' : 'inactivo'}</span></td>
            <td><button class="btn btn-outline-primary btn-sm">Editar</button></td>
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
            .map((log) => `
          <tr>
            <td>${log.fecha ?? ''}</td>
            <td>${log.usuario ?? ''}</td>
            <td>${log.accion ?? ''}</td>
            <td>${log.entidad ?? ''}</td>
            <td>${log.entidadId ?? ''}</td>
            <td>${log.ip ?? ''}</td>
          </tr>
        `)
            .join('');
    }
    renderEstadoEdificio(estado) {
        const section = document.getElementById('admin-section-estado');
        if (!section) {
            return;
        }
        section.innerHTML = `
      <h2 class="h5">Estado del Edificio</h2>
      <p class="fw-bold">Personas en instalaciones: ${estado.totalPresentes}</p>
      <ul class="list-group">
        ${estado.presentes
            .map((item) => `<li class="list-group-item d-flex justify-content-between"><span>${item.nombre}</span><span>${item.departamento} · ${item.horaIngreso}</span></li>`)
            .join('')}
      </ul>
    `;
    }
}
