import { AbstractRegistroAcceso, RegistroAccesoInterface } from './AbstractRegistroAcceso';

export class RegistroAcceso extends AbstractRegistroAcceso {
  constructor(data: RegistroAccesoInterface) {
    super(data);
  }
}
