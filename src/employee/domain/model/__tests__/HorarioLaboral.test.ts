import { HorarioLaboral } from '../HorarioLaboral';

describe('HorarioLaboral', () => {
  it('isValid() debe retornar true para horario válido 09:00-17:00', () => {
    const horario = new HorarioLaboral('09:00', '17:00');
    expect(horario.isValid()).toBe(true);
  });

  it('isValid() debe retornar false si hora inicio >= hora fin', () => {
    const horario = new HorarioLaboral('17:00', '17:00');
    expect(horario.isValid()).toBe(false);
  });

  it('estaEnHorario() debe retornar true si la hora está en el rango', () => {
    const horario = new HorarioLaboral('09:00', '17:00');
    expect(horario.estaEnHorario('10:30')).toBe(true);
  });

  it('minutosRetraso() debe retornar 0 si es puntual', () => {
    const horario = new HorarioLaboral('09:00', '17:00');
    expect(horario.minutosRetraso('08:59')).toBe(0);
  });

  it('minutosRetraso() debe retornar N minutos si es tarde', () => {
    const horario = new HorarioLaboral('09:00', '17:00');
    expect(horario.minutosRetraso('09:13')).toBe(13);
  });
});
