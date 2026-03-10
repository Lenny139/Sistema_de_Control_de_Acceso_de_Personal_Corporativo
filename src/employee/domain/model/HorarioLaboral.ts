export class HorarioLaboral {
  constructor(
    private readonly horaInicio: string,
    private readonly horaFin: string,
  ) {}

  readonly getHoraInicio = (): string => this.horaInicio;
  readonly getHoraFin = (): string => this.horaFin;

  readonly isValid = (): boolean => {
    if (!this.isHoraFormatoValido(this.horaInicio) || !this.isHoraFormatoValido(this.horaFin)) {
      return false;
    }

    return this.toMinutes(this.horaInicio) < this.toMinutes(this.horaFin);
  };

  readonly estaEnHorario = (horaActual: string): boolean => {
    if (!this.isValid() || !this.isHoraFormatoValido(horaActual)) {
      return false;
    }

    const actual = this.toMinutes(horaActual);
    const inicio = this.toMinutes(this.horaInicio);
    const fin = this.toMinutes(this.horaFin);

    return actual >= inicio && actual <= fin;
  };

  readonly minutosRetraso = (horaEntrada: string): number => {
    if (!this.isValid() || !this.isHoraFormatoValido(horaEntrada)) {
      return 0;
    }

    const entrada = this.toMinutes(horaEntrada);
    const inicio = this.toMinutes(this.horaInicio);

    return entrada > inicio ? entrada - inicio : 0;
  };

  readonly toString = (): string => `${this.horaInicio} - ${this.horaFin}`;

  private readonly isHoraFormatoValido = (hora: string): boolean => {
    const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hora);
    return match;
  };

  private readonly toMinutes = (hora: string): number => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  };
}
