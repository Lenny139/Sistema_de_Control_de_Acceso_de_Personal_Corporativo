import { Repository } from '../../../../../shared/domain/Repository';
import { Empleado } from '../../../../domain/model/Empleado';

export interface EmpleadoRepositoryPort extends Repository<string, Empleado> {
  findByCodigoEmpleado(codigo: string): Promise<Empleado | null>;
  findByDepartamento(departamento: string): Promise<Empleado[]>;
  findByNombreOrCodigo(query: string): Promise<Empleado[]>;
  findActivos(): Promise<Empleado[]>;
}
