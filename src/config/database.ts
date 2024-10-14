import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      dbName: process.env.DB_DATABASE // Especifica o nome do banco de dados
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// import { DataSource } from 'typeorm';

// export const MongoDataSource = new DataSource({
//   name: 'default',
//   type: 'mongodb',
//   authSource: 'admin',
//   database: process.env.DB_DATABASE,
//   url: process.env.DB_CONNECTION_STRING,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   entities: ['src/models/*.ts'],
//   logging: true,
//   synchronize: true
// });

// export const MysqlDataSource = new DataSource({
//   name: 'default',
//   type: 'mysql',
//   database: process.env.DB_DATABASE,
//   url: process.env.DB_CONNECTION_STRING,
//   entities: ['src/entity/*.ts', 'entity/*.js'],
//   logging: true,
//   synchronize: true
// });
