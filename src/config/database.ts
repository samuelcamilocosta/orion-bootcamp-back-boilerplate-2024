import dotenv from 'dotenv'
import { DataSource } from 'typeorm';

dotenv.config();

// Use uma string de conexão MongoDB diretamente
export const MongoDataSource = new DataSource({
    type: 'mongodb',
    url : process.env.DB_CONNECTION_STRING || '',
    database: process.env.DB_DATABASE || 'reforca',
    synchronize: false,
    logging: true,
    entities: ['src/models/*.ts']
});

export const connectDB = async () => {
    try {
        await MongoDataSource.initialize();
        console.log('MongoDB connected successfully with TypeORM!');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
