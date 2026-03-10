import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Control de Acceso de Personal Corporativo',
      version: '1.0.0',
      description: 'API backend para autenticación, control de acceso, visitantes, reportes y auditoría',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.resolve(process.cwd(), 'src/**/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    url: '/api/1.0/docs.json',
    persistAuthorization: true,
  },
};
