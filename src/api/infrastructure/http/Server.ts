import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppRouter } from './AppRouter';
import { swaggerSpec } from '../swagger/swagger';

export class Server {
  private readonly app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
  }

  private readonly configure = (): void => {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  };

  private readonly routes = (): void => {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ ok: true });
    });

    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.app.use('/api/v1', AppRouter.build());
  };

  readonly listen = (port: number): void => {
    this.app.listen(port, () => {
      process.stdout.write(`Server running on port ${port}\n`);
    });
  };
}
