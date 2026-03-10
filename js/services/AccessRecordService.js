import { ApiClient } from '../core/ApiClient';
export class AccessRecordService {
    constructor() {
        this.api = new ApiClient();
    }
    getHistorial() {
        return this.api.get('/access-records');
    }
    getPresentes() {
        return this.api.get('/access-records/presentes');
    }
    checkIn(empleadoId, puntoControlId, observaciones) {
        return this.api.post('/access-records/check-in', {
            empleadoId,
            puntoControlId,
            observaciones,
        });
    }
    checkOut(empleadoId, puntoControlId) {
        return this.api.post('/access-records/check-out', {
            empleadoId,
            puntoControlId,
        });
    }
}
