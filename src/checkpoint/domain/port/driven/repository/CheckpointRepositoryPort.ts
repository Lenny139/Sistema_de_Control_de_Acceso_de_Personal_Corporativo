import { Repository } from '../../../../../shared/domain/Repository';
import { Checkpoint } from '../../../../domain/model/Checkpoint';

export interface CheckpointRepositoryPort extends Repository<string, Checkpoint> {
  findByNombre(nombre: string): Promise<Checkpoint | null>;
  findActivos(): Promise<Checkpoint[]>;
}
