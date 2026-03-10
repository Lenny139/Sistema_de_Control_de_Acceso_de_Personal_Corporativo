import { ETipoAcceso } from '../../../../access-record/domain/model/ETipoAcceso';
import { ReportePuntualidadGenerator } from '../ReportePuntualidadGenerator';
import {
  PuntualidadParams,
  RegistroParaReporte,
  ReporteRepositoryPort,
} from '../../../domain/port/driven/repository/ReporteRepositoryPort';

describe('ReportePuntualidadGenerator', () => {
  const baseParams: PuntualidadParams = {
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

  const createGenerator = (rows: RegistroParaReporte[]): ReportePuntualidadGenerator => {
    const repository: ReporteRepositoryPort = {
      getRegistrosParaAsistencia: jest.fn(),
      getRegistrosParaPuntualidad: jest.fn().mockResolvedValue(rows),
    };

    return new ReportePuntualidadGenerator(repository);
  };

  it('debe marcar como PUNTUAL si llega antes o a la hora', async () => {
    const rows = [buildRegistro({ timestampRegistro: new Date(2026, 2, 8, 8, 55, 0) })];
    const generator = createGenerator(rows);

    const result = await generator.generate(baseParams);

    expect(result.data[0].estadoPuntualidad).toBe('PUNTUAL');
    expect(result.data[0].minutosRetraso).toBe(0);
  });

  it('debe marcar como TARDANZA con minutos correctos', async () => {
    const rows = [buildRegistro({ timestampRegistro: new Date(2026, 2, 8, 9, 15, 0) })];
    const generator = createGenerator(rows);

    const result = await generator.generate(baseParams);

    expect(result.data[0].estadoPuntualidad).toBe('TARDANZA');
    expect(result.data[0].minutosRetraso).toBe(15);
  });

  it('debe marcar como AUSENTE si no hay registro de entrada', async () => {
    const rows = [buildRegistro({ timestampRegistro: null, tipo: null })];
    const generator = createGenerator(rows);

    const result = await generator.generate(baseParams);

    expect(result.data[0].estadoPuntualidad).toBe('AUSENTE');
    expect(result.data[0].horaEntrada).toBeNull();
  });
});
