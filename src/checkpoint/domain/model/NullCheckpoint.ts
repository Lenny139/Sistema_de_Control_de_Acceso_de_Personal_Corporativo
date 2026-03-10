import { AbstractCheckpoint } from './AbstractCheckpoint';

export class NullCheckpoint extends AbstractCheckpoint {
  constructor() {
    super({
      id: '',
      nombre: 'Sin punto de control',
      descripcion: '',
      activo: false,
      createdAt: new Date(0),
    });
  }

  readonly isNull = (): boolean => true;
}
