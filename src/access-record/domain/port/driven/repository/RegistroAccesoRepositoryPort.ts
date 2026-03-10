import { Repository } from '../../../../../shared/domain/Repository';
import { EstadoPresencia } from '../../../../domain/model/EstadoPresencia';
import { RegistroAcceso } from '../../../../domain/model/RegistroAcceso';

export interface RegistroAccesoRepositoryPort extends Repository<string, RegistroAcceso> {
  findByEmpleadoAndFecha(empleadoId: string, fecha: string): Promise<RegistroAcceso[]>;
  findByEmpleadoAndRango(
    empleadoId: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]>;
  findByDepartamentoAndRango(
    departamento: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RegistroAcceso[]>;
  findUltimoRegistroHoy(empleadoId: string): Promise<RegistroAcceso | null>;
  findEmpleadosPresentes(): Promise<EstadoPresencia[]>;
  findByPuntoControl(puntoControlId: string, fecha: string): Promise<RegistroAcceso[]>;
}
