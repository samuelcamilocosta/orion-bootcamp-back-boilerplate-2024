import { CustomError } from '../interfaces/CustomError';
import { UserRepository } from '../repositories/UserRepository';
import { comparePassword } from '../library/bcrypt';
import { JwtService } from '../library/jwt';

/**
 * Serviço de autenticação para lidar com lógica de login.
 */
export class AuthService {
    private userRepository: UserRepository;

    constructor() {
        // Inicializa o UserRepository como uma classe
        this.userRepository = new UserRepository();
    }

    /**
     * Função para autenticar o usuário e gerar um token JWT.
     *
     * @param email - Email do usuário.
     * @param password - Senha do usuário.
     * @returns O token JWT gerado.
     */
    async loginUser(email: string, password: string): Promise<string> {
        // Verifica se o usuário existe utilizando o UserRepository encapsulado
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new CustomError('Usuário não encontrado', 404);
        }

        // Compara a senha utilizando a função de biblioteca
        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new CustomError('Credenciais inválidas', 401);
        }

        // Gera e retorna o token JWT usando o JwtService
        return JwtService.generateToken(
            { userId: user.id }, // Payload
            process.env.JWT_SECRET!, // Segredo para assinar o token
            '1h' // Expiração do token
        );
    }
}
