import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.OAS3Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Orion Constellation API',
      description: 'Documentação da API do projeto Orion.',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'http://localhost:4444',
        description: 'Servidor Local'
      }
    ],
    tags: [{ name: 'Auth', description: 'Rotas relacionadas à autenticação' }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['src/controller/*.ts', 'src/docs/*.ts']
};
