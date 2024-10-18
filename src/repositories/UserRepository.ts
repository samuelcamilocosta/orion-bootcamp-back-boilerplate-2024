import { MongoDataSource } from '../config/database';
import { User } from '../models/Users';

/**
 * Repositório de usuários que interage com o banco de dados MongoDB.
 */
export const UserRepository = MongoDataSource.getMongoRepository(User);

/**
 * Busca um usuário no banco de dados pelo email.
 *
 * @param email - O email do usuário que está sendo buscado.
 * @returns O usuário correspondente ao email ou `null` se não encontrado.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  return UserRepository.findOne({ where: { email } });
};
