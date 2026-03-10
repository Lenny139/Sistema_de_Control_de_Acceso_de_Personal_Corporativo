import { Server } from './api/infrastructure/http/Server';

const port = Number(process.env.PORT ?? 3000);

new Server().listen(port);
