import { ApiClient } from '../core/ApiClient';
import { EstadoPresencia } from '../models/RegistroAcceso.model';
import { RegistroAcceso } from '../models/RegistroAcceso.model';

export class AccessRecordService {
  private readonly api = new ApiClient();

  public getHistorial(): Promise<RegistroAcceso[]> {
    return this.api.get<RegistroAcceso[]>('/access-records');
  }

  public getPresentes(): Promise<EstadoPresencia[]> {
    return this.api.get<EstadoPresencia[]>('/access-records/presentes');
  }

  public checkIn(
    empleadoId: string,
    puntoControlId: string,
    observaciones?: string,
  ): Promise<RegistroAcceso> {
    return this.api.post<RegistroAcceso>('/access-records/check-in', {
      empleadoId,
      puntoControlId,
      observaciones,
    });
  }

  public checkOut(empleadoId: string, puntoControlId: string): Promise<RegistroAcceso> {
    return this.api.post<RegistroAcceso>('/access-records/check-out', {
      empleadoId,
      puntoControlId,
    });
  }
}
