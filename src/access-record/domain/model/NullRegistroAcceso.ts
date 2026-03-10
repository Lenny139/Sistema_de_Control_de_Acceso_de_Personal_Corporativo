import { AbstractRegistroAcceso } from './AbstractRegistroAcceso';
import { ETipoAcceso } from './ETipoAcceso';

export class NullRegistroAcceso extends AbstractRegistroAcceso {
  constructor() {
    super({
      id: '',
      empleadoId: '',
      puntoControlId: '',
      guardiaId: '',
      tipo: ETipoAcceso.ENTRADA,
      timestampRegistro: new Date(0),
      observaciones: null,
      createdAt: new Date(0),
    });
  }

  readonly isNull = (): boolean => true;
}
