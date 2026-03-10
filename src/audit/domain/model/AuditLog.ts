import { AbstractAuditLog, AuditLogInterface } from './AbstractAuditLog';

export class AuditLog extends AbstractAuditLog {
  constructor(data: AuditLogInterface) {
    super(data);
  }
}
