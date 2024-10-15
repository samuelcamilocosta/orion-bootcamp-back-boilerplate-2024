import { DataSource } from 'typeorm';

// Use uma string de conexão MongoDB diretamente
export const MongoDataSource = new DataSource({
    type: 'mongodb',
    url:
        process.env.DB_CONNECTION_STRING ||
        'mongodb://reforca_root:j5m966qp7jiypfda@reforca-mongo:27017/admin',
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
