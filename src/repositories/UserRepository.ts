import { MongoDataSource } from '../config/database';
import { User } from '../models/Users';

export const UserRepository = MongoDataSource.getMongoRepository(User);
