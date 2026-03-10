import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { CheckpointService } from '../../application/service/CheckpointService';
import { CheckpointUsecase } from '../../application/usecase/CheckpointUsecase';
import { CheckpointController } from '../adapter/api/CheckpointController';
import { CheckpointRouter } from '../adapter/api/CheckpointRouter';
import { CheckpointSQLiteRepository } from '../adapter/repository/CheckpointSQLiteRepository';

export class CheckpointFactory {
  static create(): ApiRouter {
    const checkpointRepository = new CheckpointSQLiteRepository();
    const checkpointService = new CheckpointService(checkpointRepository);
    const checkpointUsecase = new CheckpointUsecase(checkpointService);
    const checkpointController = new CheckpointController(checkpointUsecase);

    return new CheckpointRouter(checkpointController);
  }
}
