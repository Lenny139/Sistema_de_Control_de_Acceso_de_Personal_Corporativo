import { Server } from './api/infrastructure/adapter/express/Server';
import { SQLiteDatabase } from './api/infrastructure/adapter/database/SQLiteDatabase';
import { EnvironmentProvider } from './api/infrastructure/provider/EnvironmentProvider';
import { AccessRecordFactory } from './access-record/infrastructure/factory/AccessRecordFactory';
import { AuthFactory } from './auth/infrastructure/factory/AuthFactory';
import { AuditFactory } from './audit/infrastructure/factory/AuditFactory';
import { CheckpointFactory } from './checkpoint/infrastructure/factory/CheckpointFactory';
import { EmployeeFactory } from './employee/infrastructure/factory/EmployeeFactory';
import { ErrorRouter } from './error/infrastructure/adapter/api/ErrorRouter';
import { ReporteFactory } from './report/infrastructure/factory/ReporteFactory';
import { VisitorFactory } from './visitor/infrastructure/factory/VisitorFactory';

const bootstrap = async (): Promise<void> => {
	try {
		const environment = EnvironmentProvider.getInstance();
		SQLiteDatabase.getInstance();

		const server = new Server();

		server.useRouter(AuthFactory.create());
		server.useRouter(EmployeeFactory.create());
		server.useRouter(CheckpointFactory.create());
		server.useRouter(AccessRecordFactory.create());
		server.useRouter(VisitorFactory.create());
		server.useRouter(ReporteFactory.create());
		server.useRouter(AuditFactory.create());
		server.useRouter(new ErrorRouter());

		const host = environment.getHost();
		const port = environment.getPort();

		server.start(port, host);

		process.stdout.write(`API: http://${host}:${port}\n`);
		process.stdout.write(`Swagger UI: http://${host}:${port}/api/1.0/docs\n`);
		process.stdout.write(`Swagger JSON: http://${host}:${port}/api/1.0/docs.json\n`);
	} catch (error) {
		process.stderr.write(`Error iniciando la aplicación: ${String(error)}\n`);
		process.exit(1);
	}
};

void bootstrap();
