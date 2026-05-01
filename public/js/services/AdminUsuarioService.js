import { ApiClient } from '../core/ApiClient.js';
export class AdminUsuarioService {
    constructor() {
        this.api = new ApiClient();
    }
    getAll() {
        return this.api.get('/auth/users');
    }
    create(dto) {
        return this.api.post('/auth/users', dto);
    }
    update(id, data) {
        return this.api.put(`/auth/users/${id}`, data);
    }
    deactivate(id) {
        return this.api.delete(`/auth/users/${id}`);
    }
}
