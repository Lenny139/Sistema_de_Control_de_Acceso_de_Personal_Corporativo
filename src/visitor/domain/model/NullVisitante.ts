import { AbstractVisitante } from './AbstractVisitante';

export class NullVisitante extends AbstractVisitante {
  constructor() {
    super({
      id: '',
      nombre: '',
      apellido: '',
      documentoIdentidad: '',
      empresa: '',
      empleadoAnfitrionId: '',
      guardiaId: '',
      puntoControlId: '',
      horaEntrada: new Date(0),
      horaSalida: null,
      fechaVisita: '1970-01-01',
      observaciones: '',
      createdAt: new Date(0),
    });
  }

  readonly isNull = (): boolean => true;
}
