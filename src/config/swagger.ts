import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Reforça o Bem API',
      description: 'Documentação da API do projeto Reforça o Bem.',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:4444/api',
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token no formato: Bearer {token}',
        },
      },
    },
    externalDocs: {
      description: 'Ver swagger.json',
      url: '/swagger.json',
    },
  },
  apis: ['src/controller/*.ts', 'src/routes/*.ts'],
};
