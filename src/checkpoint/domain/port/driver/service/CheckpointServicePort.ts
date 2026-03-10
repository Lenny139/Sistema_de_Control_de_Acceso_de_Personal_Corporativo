import { Checkpoint } from '../../../../domain/model/Checkpoint';
import { CreateCheckpointDto } from '../../../../domain/model/CreateCheckpointDto';
import { UpdateCheckpointDto } from '../../../../domain/model/UpdateCheckpointDto';

export interface CheckpointServicePort {
  createCheckpoint(data: CreateCheckpointDto): Promise<Checkpoint>;
  updateCheckpoint(id: string, data: UpdateCheckpointDto): Promise<Checkpoint>;
  deleteCheckpoint(id: string): Promise<boolean>;
  getCheckpointById(id: string): Promise<Checkpoint>;
  getAllCheckpoints(): Promise<Checkpoint[]>;
}
