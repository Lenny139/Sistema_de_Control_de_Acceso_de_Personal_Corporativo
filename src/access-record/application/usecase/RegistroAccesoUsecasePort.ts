import { ETipoAcceso } from '../../domain/model/ETipoAcceso';
import { EstadoPresencia } from '../../domain/model/EstadoPresencia';
import { RegistrarAccesoDto } from '../../domain/model/RegistrarAccesoDto';
import { RegistroAcceso } from '../../domain/model/RegistroAcceso';

export interface RegistroAccesoUsecasePort {
  checkIn(dto: RegistrarAccesoDto): Promise<RegistroAcceso>;
  checkOut(dto: RegistrarAccesoDto): Promise<RegistroAcceso>;
  getDashboardPresentes(): Promise<EstadoPresencia[]>;
  getHistorialEmpleado(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]>;
  getEstadoEmpleado(empleadoId: string): Promise<ETipoAcceso | null>;
}
