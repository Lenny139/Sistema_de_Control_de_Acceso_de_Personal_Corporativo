import { SQLiteDatabase } from '../../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { AuditServiceSingleton } from '../../../../audit/infrastructure/factory/AuditServiceSingleton';
import { ConflictError, NotFoundError } from '../../../../shared/domain/DomainError';
import { ETipoAcceso } from '../../../domain/model/ETipoAcceso';
import { RegistroAcceso } from '../../../domain/model/RegistroAcceso';
import { RegistroAccesoRepositoryPort } from '../../../domain/port/driven/repository/RegistroAccesoRepositoryPort';
import { RegistroAccesoService } from '../RegistroAccesoService';

describe('RegistroAccesoService', () => {
  const dto = {
    empleadoId: 'emp-1',
    puntoControlId: 'pc-1',
    guardiaId: 'guard-1',
    observaciones: 'ok',
  };

  let repository: jest.Mocked<RegistroAccesoRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByEmpleadoAndFecha: jest.fn(),
      findByEmpleadoAndRango: jest.fn(),
      findByDepartamentoAndRango: jest.fn(),
      findUltimoRegistroHoy: jest.fn(),
      findEmpleadosPresentes: jest.fn(),
      findByPuntoControl: jest.fn(),
    };

    jest.spyOn(SQLiteDatabase, 'getInstance').mockReturnValue({
      prepare: (sql: string) => ({
        get: (id: string) => {
          if (sql.includes('FROM empleados')) {
            if (id === 'missing') {
              return undefined;
            }
            return { id, activo: 1 };
          }

          if (sql.includes('FROM puntos_control')) {
            return { id, activo: 1 };
          }

          return undefined;
        },
      }),
    } as any);

    jest.spyOn(AuditServiceSingleton, 'getInstance').mockReturnValue({
      log: jest.fn().mockResolvedValue(undefined),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const buildRegistro = (tipo: ETipoAcceso): RegistroAcceso =>
    new RegistroAcceso({
      id: 'reg-1',
      empleadoId: dto.empleadoId,
      puntoControlId: dto.puntoControlId,
      guardiaId: dto.guardiaId,
      tipo,
      timestampRegistro: new Date('2026-03-08T09:00:00.000Z'),
      observaciones: null,
      createdAt: new Date('2026-03-08T09:00:00.000Z'),
    });

  it('registrarEntrada() debe crear el registro exitosamente cuando el empleado está ausente', async () => {
    repository.findUltimoRegistroHoy.mockResolvedValue(null);
    repository.save.mockImplementation(async (entity) => entity);

    const service = new RegistroAccesoService(repository);
    const result = await service.registrarEntrada(dto);

    expect(result.getTipo()).toBe(ETipoAcceso.ENTRADA);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('registrarEntrada() debe lanzar ConflictError si el empleado ya tiene entrada registrada', async () => {
    repository.findUltimoRegistroHoy.mockResolvedValue(buildRegistro(ETipoAcceso.ENTRADA));

    const service = new RegistroAccesoService(repository);

    await expect(service.registrarEntrada(dto)).rejects.toBeInstanceOf(ConflictError);
  });

  it('registrarSalida() debe crear el registro exitosamente cuando el empleado está presente', async () => {
    repository.findUltimoRegistroHoy.mockResolvedValue(buildRegistro(ETipoAcceso.ENTRADA));
    repository.save.mockImplementation(async (entity) => entity);

    const service = new RegistroAccesoService(repository);
    const result = await service.registrarSalida(dto);

    expect(result.getTipo()).toBe(ETipoAcceso.SALIDA);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('registrarSalida() debe lanzar ConflictError si el empleado no tiene entrada registrada hoy', async () => {
    repository.findUltimoRegistroHoy.mockResolvedValue(null);
    const service = new RegistroAccesoService(repository);

    await expect(service.registrarSalida(dto)).rejects.toBeInstanceOf(ConflictError);
  });

  it('registrarEntrada() debe lanzar NotFoundError si el empleado no existe', async () => {
    const service = new RegistroAccesoService(repository);

    await expect(service.registrarEntrada({ ...dto, empleadoId: 'missing' })).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });
});
