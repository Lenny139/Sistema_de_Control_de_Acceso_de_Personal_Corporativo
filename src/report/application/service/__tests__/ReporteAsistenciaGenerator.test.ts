import { ETipoAcceso } from '../../../../access-record/domain/model/ETipoAcceso';
import { ReporteAsistenciaGenerator } from '../ReporteAsistenciaGenerator';
import {
  AsistenciaParams,
  RegistroParaReporte,
  ReporteRepositoryPort,
} from '../../../domain/port/driven/repository/ReporteRepositoryPort';

describe('ReporteAsistenciaGenerator', () => {
  const baseParams: AsistenciaParams = {
    fechaInicio: '2026-03-01',
    fechaFin: '2026-03-31',
  };

  const buildRegistro = (overrides: Partial<RegistroParaReporte>): RegistroParaReporte => ({
    empleadoId: 'emp-1',
    codigoEmpleado: 'EMP-001',
    nombreCompleto: 'Carlos Ramirez',
    departamento: 'Tecnologia',
    fecha: '2026-03-08',
    timestampRegistro: new Date(2026, 2, 8, 9, 0, 0),
    tipo: ETipoAcceso.ENTRADA,
    puntoControlId: 'pc-1',
    nombrePuntoControl: 'Entrada Principal',
    horaInicioLaboral: '09:00',
    horaFinLaboral: '17:00',
    ...overrides,
  });

  const createGenerator = (rows: RegistroParaReporte[]): ReporteAsistenciaGenerator => {
    const repository: ReporteRepositoryPort = {
      getRegistrosParaAsistencia: jest.fn().mockResolvedValue(rows),
      getRegistrosParaPuntualidad: jest.fn(),
    };

    return new ReporteAsistenciaGenerator(repository);
  };

  it('debe calcular correctamente las horas trabajadas cuando hay entrada y salida', async () => {
    const rows = [
      buildRegistro({ tipo: ETipoAcceso.ENTRADA, timestampRegistro: new Date(2026, 2, 8, 9, 0, 0) }),
      buildRegistro({ tipo: ETipoAcceso.SALIDA, timestampRegistro: new Date(2026, 2, 8, 17, 0, 0) }),
    ];

    const generator = createGenerator(rows);
    const result = await generator.generate(baseParams);

    expect(result.data[0].horasTrabajadas).toBe(8);
  });

  it('debe retornar 0 horas trabajadas si no hay salida registrada', async () => {
    const rows = [
      buildRegistro({ tipo: ETipoAcceso.ENTRADA, timestampRegistro: new Date(2026, 2, 8, 9, 0, 0) }),
    ];

    const generator = createGenerator(rows);
    const result = await generator.generate(baseParams);

    expect(result.data[0].horasTrabajadas).toBe(0);
    expect(result.data[0].horaSalida).toBeNull();
  });

  it('debe agrupar correctamente múltiples registros del mismo empleado en el mismo día', async () => {
    const rows = [
      buildRegistro({ tipo: ETipoAcceso.ENTRADA, timestampRegistro: new Date(2026, 2, 8, 8, 55, 0) }),
      buildRegistro({ tipo: ETipoAcceso.SALIDA, timestampRegistro: new Date(2026, 2, 8, 12, 0, 0) }),
      buildRegistro({ tipo: ETipoAcceso.ENTRADA, timestampRegistro: new Date(2026, 2, 8, 13, 0, 0) }),
      buildRegistro({ tipo: ETipoAcceso.SALIDA, timestampRegistro: new Date(2026, 2, 8, 17, 5, 0) }),
    ];

    const generator = createGenerator(rows);
    const result = await generator.generate(baseParams);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].registros).toHaveLength(4);
    expect(result.data[0].horaEntrada).toBe('08:55');
    expect(result.data[0].horaSalida).toBe('17:05');
  });

  it('debe ordenar los registros cronológicamente', async () => {
    const rows = [
      buildRegistro({ fecha: '2026-03-10', empleadoId: 'emp-2', codigoEmpleado: 'EMP-002', nombreCompleto: 'Laura Gomez' }),
      buildRegistro({ fecha: '2026-03-08', empleadoId: 'emp-1', codigoEmpleado: 'EMP-001', nombreCompleto: 'Carlos Ramirez' }),
    ];

    const generator = createGenerator(rows);
    const result = await generator.generate(baseParams);

    expect(result.data[0].fecha).toBe('2026-03-08');
    expect(result.data[1].fecha).toBe('2026-03-10');
  });
});
