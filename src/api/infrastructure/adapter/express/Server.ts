import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { ApiRouter } from '../../../domain/model/ApiRouter';
import { HTTPStatusCode } from '../../../domain/status/HTTPStatusCode';
import { swaggerSpec, swaggerUiOptions } from '../swagger/SwaggerConfig';

export class Server {
  private readonly app: Express;

  constructor() {
    this.app = express();
    this.middlewares();
    this.docs();
  }

  private middlewares(): void {
    this.app.use((req: Request, _res: Response, next: NextFunction) => {
      const timestamp = new Date().toISOString();
      process.stdout.write(`[${timestamp}] ${req.method} ${req.originalUrl}\n`);
      next();
    });

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const publicPath = path.resolve(process.cwd(), 'public');
    this.app.use(express.static(publicPath, { index: false }));

    this.app.get('/', (_req: Request, res: Response) => {
      res.redirect('/index.html');
    });
  }

  private docs(): void {
    this.app.use('/api/1.0/docs', swaggerUi.serve, swaggerUi.setup(undefined, swaggerUiOptions));

    this.app.get('/api/1.0/docs.json', (_req: Request, res: Response) => {
      res.status(HTTPStatusCode.OK).json(swaggerSpec);
    });
  }

  public useRouter(router: ApiRouter): void {
    this.app.use(router.router);
  }

  public useMiddleware(
    middleware: (error: unknown, req: Request, res: Response, next: NextFunction) => void,
  ): void {
    this.app.use(middleware);
  }

  public getApp(): Express {
    return this.app;
  }

  public start(port: number, host = '0.0.0.0'): void {
    this.app.listen(port, host, () => {
      process.stdout.write(`Server listening on http://${host}:${port}\n`);
    });
  }
}
