import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { connectDB } from './config/database';
import { swaggerConfig } from './config/swagger';
import routes from './routes/routes';

// Conectar ao banco de dados
connectDB();

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

// Vincular as rotas da API
app.use('/api', routes); // Todas as rotas no /api

// Configuração do Swagger
const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => res.send(swaggerSpec));

console.log(`Swagger disponível em /swagger`);

app.listen(process.env.SERVER_PORT || 4444, () => {
    console.log(`Servidor rodando na porta ${process.env.SERVER_PORT || 4444}`);
});
