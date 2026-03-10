import { Repository } from '../../../../../shared/domain/Repository';
import { Visitante } from '../../../../domain/model/Visitante';

export interface VisitanteRepositoryPort extends Repository<string, Visitante> {
  findByFecha(fecha: string): Promise<Visitante[]>;
  findPresentes(): Promise<Visitante[]>;
  findByEmpleadoAnfitrion(empleadoId: string): Promise<Visitante[]>;
  findByDocumento(documento: string, fecha: string): Promise<Visitante | null>;
}
