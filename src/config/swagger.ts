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
      schemas: {
        /**
         * Definindo o schema do estudante (Student)
         */
        Student: {
          type: 'object',
          required: [
            'userId',
            'birthDate',
            'educationLevel',
            'schoolType',
            'subjectsOfInterest',
            'phoneNumber',
          ],
          properties: {
            userId: {
              type: 'string',
              description: 'ID do usuário vinculado ao aluno',
            },
            birthDate: {
              type: 'string',
              example: '01/01/2024',
              description: 'Data de nascimento no formato DD/MM/AAAA',
            },
            educationLevel: {
              type: 'string',
              example: 'Ensino Médio (1º ano), (2º ano) ou (3º ano)',
              enum: [
                'Ensino Médio (1º ano)',
                'Ensino Médio (2º ano)',
                'Ensino Médio (3º ano)',
              ],
              description: 'Escolaridade do aluno',
            },
            schoolType: {
              type: 'string',
              example: 'Escola Pública ou Escola Privada',
              enum: ['Escola Pública', 'Escola Privada'],
              description: 'Tipo de escola do aluno',
            },
            subjectsOfInterest: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'Língua Portuguesa',
                  'Inglês',
                  'Artes',
                  'Educação Física',
                  'Matemática',
                  'Física',
                  'Química',
                  'Biologia',
                  'História',
                  'Geografia',
                  'Filosofia',
                  'Sociologia',
                ],
              },
              description: 'Matérias de interesse do aluno',
            },
            phoneNumber: {
              type: 'string',
              example: '(xx) 99999-9999',
              description:
                'Número de celular com DDD, formatado como (XX) XXXXX-XXXX',
            },
          },
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
