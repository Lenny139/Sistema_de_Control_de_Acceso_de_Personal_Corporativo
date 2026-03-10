import { Checkpoint } from '../../domain/model/Checkpoint';
import { CreateCheckpointDto } from '../../domain/model/CreateCheckpointDto';
import { UpdateCheckpointDto } from '../../domain/model/UpdateCheckpointDto';

export interface CheckpointUsecasePort {
  getAllCheckpoints(): Promise<Checkpoint[]>;
  getCheckpointById(id: string): Promise<Checkpoint>;
  createCheckpoint(dto: CreateCheckpointDto): Promise<Checkpoint>;
  updateCheckpoint(id: string, dto: UpdateCheckpointDto): Promise<Checkpoint>;
  deleteCheckpoint(id: string): Promise<boolean>;
}
