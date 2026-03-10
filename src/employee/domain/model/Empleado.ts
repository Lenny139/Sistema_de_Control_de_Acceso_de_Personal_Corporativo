import { AbstractEmpleado, EmpleadoInterface } from './AbstractEmpleado';

export class Empleado extends AbstractEmpleado {
  constructor(data: EmpleadoInterface) {
    super(data);
  }
}
