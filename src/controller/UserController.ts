import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import { hashPassword } from '../library/bcrypt';
import { CustomError } from '../interfaces/CustomError';

/**
 * Controlador para operações relacionadas aos usuários.
 */
export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Cria um novo usuário.
   *
   * @param req - Requisição contendo os dados do usuário.
   * @param res - Resposta HTTP.
   * @returns Uma resposta contendo os dados do usuário criado ou uma mensagem de erro.
   */
  async createUser(req: Request, res: Response): Promise<Response> {
    const { name, email, password, confirmPassword } = req.body;

    try {
      // Validação do email
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new CustomError('Email já cadastrado', 400);
      }

      // Validação do tamanho da senha
      if (password.length < 8) {
        throw new CustomError(
          'A senha deve conter pelo menos 8 caracteres',
          400,
        );
      }

      // Validação de senhas correspondentes
      if (password !== confirmPassword) {
        throw new CustomError('As senhas não coincidem', 400);
      }

      // Cria o hash da senha
      const hashedPassword = await hashPassword(password);

      // Cria o novo usuário
      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      // Salva o novo usuário no banco de dados
      await this.userRepository.save(newUser);

      // Retorna uma resposta de sucesso
      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: { id: newUser.id, email: newUser.email },
      });
    } catch (error) {
      // Tratamento de erros no processo de criação de usuário
      if (error instanceof CustomError) {
        return res.status(error.status).json({ message: error.message });
      }

      // Tratamento de erro desconhecido
      return res
        .status(500)
        .json({ message: 'Erro desconhecido ao criar usuário' });
    }
  }
}
