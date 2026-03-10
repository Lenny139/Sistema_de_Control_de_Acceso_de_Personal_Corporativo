import { ApiClient } from '../core/ApiClient';
export class EmpleadoService {
    constructor() {
        this.api = new ApiClient();
    }
    getAll() {
        return this.api.get('/employees');
    }
    search(query) {
        return this.api.get(`/employees/search?q=${encodeURIComponent(query)}`);
    }
    create(dto) {
        return this.api.post('/employees', dto);
    }
    update(id, dto) {
        return this.api.put(`/employees/${id}`, dto);
    }
    delete(id) {
        return this.api.delete(`/employees/${id}`);
    }
}
