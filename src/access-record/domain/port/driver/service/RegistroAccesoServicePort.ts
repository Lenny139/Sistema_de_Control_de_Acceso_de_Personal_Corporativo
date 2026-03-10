import { ETipoAcceso } from '../../../../domain/model/ETipoAcceso';
import { EstadoPresencia } from '../../../../domain/model/EstadoPresencia';
import { RegistrarAccesoDto } from '../../../../domain/model/RegistrarAccesoDto';
import { RegistroAcceso } from '../../../../domain/model/RegistroAcceso';

export interface RegistroAccesoServicePort {
  registrarEntrada(dto: RegistrarAccesoDto): Promise<RegistroAcceso>;
  registrarSalida(dto: RegistrarAccesoDto): Promise<RegistroAcceso>;
  getEmpleadosPresentes(): Promise<EstadoPresencia[]>;
  getRegistrosByEmpleado(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]>;
  getUltimoEstadoEmpleado(empleadoId: string): Promise<ETipoAcceso | null>;
}
