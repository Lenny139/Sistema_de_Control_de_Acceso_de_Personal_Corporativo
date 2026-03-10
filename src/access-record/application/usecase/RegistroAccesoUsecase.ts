import { ETipoAcceso } from '../../domain/model/ETipoAcceso';
import { EstadoPresencia } from '../../domain/model/EstadoPresencia';
import { RegistrarAccesoDto } from '../../domain/model/RegistrarAccesoDto';
import { RegistroAcceso } from '../../domain/model/RegistroAcceso';
import { RegistroAccesoServicePort } from '../../domain/port/driver/service/RegistroAccesoServicePort';
import { RegistroAccesoUsecasePort } from './RegistroAccesoUsecasePort';

export class RegistroAccesoUsecase implements RegistroAccesoUsecasePort {
  constructor(private readonly registroService: RegistroAccesoServicePort) {}

  async checkIn(dto: RegistrarAccesoDto): Promise<RegistroAcceso> {
    return this.registroService.registrarEntrada(dto);
  }

  async checkOut(dto: RegistrarAccesoDto): Promise<RegistroAcceso> {
    return this.registroService.registrarSalida(dto);
  }

  async getDashboardPresentes(): Promise<EstadoPresencia[]> {
    const presentes = await this.registroService.getEmpleadosPresentes();

    return presentes.map((item) => {
      const minutosEnInstalacion = Math.max(
        0,
        Math.floor((Date.now() - item.horaEntrada.getTime()) / 60000),
      );

      return {
        ...item,
        minutosEnInstalacion,
      };
    });
  }

  async getHistorialEmpleado(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]> {
    return this.registroService.getRegistrosByEmpleado(empleadoId, fechaInicio, fechaFin);
  }

  async getEstadoEmpleado(empleadoId: string): Promise<ETipoAcceso | null> {
    return this.registroService.getUltimoEstadoEmpleado(empleadoId);
  }
}
