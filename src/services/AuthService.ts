import { CustomError } from '../interfaces/CustomError';
import { UserRepository } from '../repositories/UserRepository';
import { comparePassword } from '../library/bcrypt';
import { JwtService } from '../library/jwt';

/**
 * Serviço de autenticação para lidar com a lógica de login.
 */
export class AuthService {
  /**
   * Autentica o usuário com base em seu e-mail e senha e gera um token JWT.
   *
   * @param email - O e-mail do usuário.
   * @param password - A senha do usuário.
   * @returns O token JWT gerado.
   * @throws {CustomError} Se o usuário não for encontrado ou se a senha for inválida.
   */
  static async loginUser(email: string, password: string): Promise<string> {
    // Verifica se o usuário existe no banco de dados
    const user = await UserRepository.findOne({ where: { email } });

    if (!user) {
      throw new CustomError('Usuário não encontrado', 404);
    }

    // Compara a senha fornecida com a senha armazenada
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError('Credenciais inválidas', 401);
    }

    // Gera e retorna o token JWT usando o JwtService
    return JwtService.generateToken(
      { userId: user.id }, // Payload
      process.env.JWT_SECRET!, // Segredo para assinar o token
      '1h', // Expiração do token
    );
  }
}
