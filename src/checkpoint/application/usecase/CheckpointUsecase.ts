import { Checkpoint } from '../../domain/model/Checkpoint';
import { CreateCheckpointDto } from '../../domain/model/CreateCheckpointDto';
import { UpdateCheckpointDto } from '../../domain/model/UpdateCheckpointDto';
import { CheckpointServicePort } from '../../domain/port/driver/service/CheckpointServicePort';
import { CheckpointUsecasePort } from './CheckpointUsecasePort';

export class CheckpointUsecase implements CheckpointUsecasePort {
  constructor(private readonly checkpointService: CheckpointServicePort) {}

  async getAllCheckpoints(): Promise<Checkpoint[]> {
    return this.checkpointService.getAllCheckpoints();
  }

  async getCheckpointById(id: string): Promise<Checkpoint> {
    return this.checkpointService.getCheckpointById(id);
  }

  async createCheckpoint(dto: CreateCheckpointDto): Promise<Checkpoint> {
    return this.checkpointService.createCheckpoint(dto);
  }

  async updateCheckpoint(id: string, dto: UpdateCheckpointDto): Promise<Checkpoint> {
    return this.checkpointService.updateCheckpoint(id, dto);
  }

  async deleteCheckpoint(id: string): Promise<boolean> {
    return this.checkpointService.deleteCheckpoint(id);
  }
}
