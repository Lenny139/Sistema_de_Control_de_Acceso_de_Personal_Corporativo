import { ApiRouter } from '../../../api/domain/model/ApiRouter';
import { AuditController } from '../adapter/api/AuditController';
import { AuditRouter } from '../adapter/api/AuditRouter';

export class AuditFactory {
  static create(): ApiRouter {
    const controller = new AuditController();
    return new AuditRouter(controller);
  }
}
