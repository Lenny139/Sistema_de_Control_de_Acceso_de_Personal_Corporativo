import { AbstractEmpleado } from './AbstractEmpleado';
import { HorarioLaboral } from './HorarioLaboral';

export class NullEmpleado extends AbstractEmpleado {
  constructor() {
    super({
      id: '',
      usuarioId: undefined,
      codigoEmpleado: '',
      nombre: '',
      apellido: '',
      departamento: '',
      cargo: '',
      horarioLaboral: new HorarioLaboral('00:00', '00:01'),
      activo: false,
      createdAt: new Date(0),
    });
  }

  readonly isNull = (): boolean => true;
}
