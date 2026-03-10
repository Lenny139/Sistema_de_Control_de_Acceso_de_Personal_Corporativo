import { ApiClient } from '../core/ApiClient';
import { Empleado } from '../models/Empleado.model';

export interface EmpleadoDTO {
  codigoEmpleado: string;
  nombre: string;
  apellido: string;
  departamento: string;
  cargo: string;
  horaInicioLaboral: string;
  horaFinLaboral: string;
}

export class EmpleadoService {
  private readonly api = new ApiClient();

  public getAll(): Promise<Empleado[]> {
    return this.api.get<Empleado[]>('/employees');
  }

  public search(query: string): Promise<Empleado[]> {
    return this.api.get<Empleado[]>(`/employees/search?q=${encodeURIComponent(query)}`);
  }

  public create(dto: EmpleadoDTO): Promise<Empleado> {
    return this.api.post<Empleado>('/employees', dto);
  }

  public update(id: string, dto: EmpleadoDTO): Promise<Empleado> {
    return this.api.put<Empleado>(`/employees/${id}`, dto);
  }

  public delete(id: string): Promise<void> {
    return this.api.delete<void>(`/employees/${id}`);
  }
}
