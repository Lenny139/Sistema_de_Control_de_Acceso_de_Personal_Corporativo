import { AbstractCheckpoint, CheckpointInterface } from './AbstractCheckpoint';

export class Checkpoint extends AbstractCheckpoint {
  constructor(data: CheckpointInterface) {
    super(data);
  }
}
