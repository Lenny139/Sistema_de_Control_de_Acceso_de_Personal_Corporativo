import { v4 as uuidv4 } from 'uuid';
import { SQLiteDatabase } from '../../../api/infrastructure/adapter/database/SQLiteDatabase';
import { ConflictError, NotFoundError, ValidationError } from '../../../shared/domain/DomainError';
import { Checkpoint } from '../../domain/model/Checkpoint';
import { CreateCheckpointDto } from '../../domain/model/CreateCheckpointDto';
import { UpdateCheckpointDto } from '../../domain/model/UpdateCheckpointDto';
import { CheckpointRepositoryPort } from '../../domain/port/driven/repository/CheckpointRepositoryPort';
import { CheckpointServicePort } from '../../domain/port/driver/service/CheckpointServicePort';

export class CheckpointService implements CheckpointServicePort {
  constructor(private readonly checkpointRepository: CheckpointRepositoryPort) {}

  async createCheckpoint(data: CreateCheckpointDto): Promise<Checkpoint> {
    const existing = await this.checkpointRepository.findByNombre(data.nombre);

    if (existing) {
      throw new ConflictError('El nombre del punto de control ya existe');
    }

    const checkpoint = new Checkpoint({
      id: uuidv4(),
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: true,
      createdAt: new Date(),
    });

    return this.checkpointRepository.save(checkpoint);
  }

  async updateCheckpoint(id: string, data: UpdateCheckpointDto): Promise<Checkpoint> {
    const existing = await this.checkpointRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Punto de control no encontrado');
    }

    if (data.nombre && data.nombre !== existing.getNombre()) {
      const sameName = await this.checkpointRepository.findByNombre(data.nombre);

      if (sameName && sameName.getId() !== id) {
        throw new ConflictError('El nombre del punto de control ya existe');
      }
    }

    const updated = await this.checkpointRepository.update(id, {
      nombre: data.nombre,
      descripcion: data.descripcion,
    } as Partial<Checkpoint>);

    if (!updated) {
      throw new NotFoundError('Punto de control no encontrado');
    }

    return updated;
  }

  async deleteCheckpoint(id: string): Promise<boolean> {
    const existing = await this.checkpointRepository.findById(id);

    if (!existing) {
      throw new NotFoundError('Punto de control no encontrado');
    }

    const db = SQLiteDatabase.getInstance();
    const row = db
      .prepare(
        `SELECT COUNT(1) AS total
         FROM registros_acceso r
         WHERE r.punto_control_id = ?
           AND r.tipo = 'ENTRADA'
           AND NOT EXISTS (
             SELECT 1
             FROM registros_acceso s
             WHERE s.empleado_id = r.empleado_id
               AND s.tipo = 'SALIDA'
               AND s.timestamp_registro >= r.timestamp_registro
           )`,
      )
      .get(id) as { total: number };

    if (row.total > 0) {
      throw new ValidationError('No se puede eliminar: hay registros de acceso activos');
    }

    return this.checkpointRepository.delete(id);
  }

  async getCheckpointById(id: string): Promise<Checkpoint> {
    const checkpoint = await this.checkpointRepository.findById(id);

    if (!checkpoint) {
      throw new NotFoundError('Punto de control no encontrado');
    }

    return checkpoint;
  }

  async getAllCheckpoints(): Promise<Checkpoint[]> {
    return this.checkpointRepository.findAll();
  }
}
