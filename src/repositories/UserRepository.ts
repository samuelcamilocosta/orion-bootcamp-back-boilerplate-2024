import { MongoRepository } from 'typeorm';
import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';

/**
 * Repositório da entidade User para encapsular o acesso aos dados.
 */
export class UserRepository {
  private repository: MongoRepository<User>;

  constructor() {
    // Inicializa o repositório do TypeORM
    this.repository = MongoDataSource.getMongoRepository(User);
  }

  /**
   * Encontra um usuário pelo e-mail.
   *
   * @param email - O e-mail do usuário.
   * @returns Uma Promise que resolve no usuário encontrado ou undefined.
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  /**
   * Salva um novo usuário no banco de dados.
   *
   * @param user - O usuário a ser salvo.
   * @returns O usuário salvo.
   */
  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  /**
   * Cria uma instância de usuário sem salvar no banco.
   *
   * @param userData - Os dados do usuário.
   * @returns A instância do usuário criada.
   */
  create(userData: Partial<User>): User {
    return this.repository.create(userData);
  }
}
