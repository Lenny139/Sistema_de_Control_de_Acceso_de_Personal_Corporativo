import { ApiClient } from '../core/ApiClient.js';
export class CheckpointService {
    constructor() {
        this.api = new ApiClient();
    }
    getAll() {
        return this.api.get('/checkpoints');
    }
    getActivos() {
        return this.api.get('/checkpoints?activo=true');
    }
    create(data) {
        return this.api.post('/checkpoints', data);
    }
    update(id, data) {
        return this.api.put(`/checkpoints/${id}`, data);
    }
    delete(id) {
        return this.api.delete(`/checkpoints/${id}`);
    }
}
