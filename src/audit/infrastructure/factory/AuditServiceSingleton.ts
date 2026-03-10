import { AuditService } from '../../application/service/AuditService';
import { AuditLogSQLiteRepository } from '../adapter/repository/AuditLogSQLiteRepository';

export class AuditServiceSingleton {
  private static instance: AuditService;

  static getInstance(): AuditService {
    if (!AuditServiceSingleton.instance) {
      AuditServiceSingleton.instance = new AuditService(new AuditLogSQLiteRepository());
    }

    return AuditServiceSingleton.instance;
  }
}
