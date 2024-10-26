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
        // Inicializa a instância da classe UserRepository
        this.userRepository = new UserRepository();
    }

    /**
     * Cria um novo usuário.
     *
     * @param req - Requisição contendo os dados do usuário.
     * @param res - Resposta HTTP.
     * @returns Uma resposta contendo os dados do usuário criado.
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        const { name, email, password, confirmPassword } = req.body;

        // Validação de senhas
        if (password !== confirmPassword) {
            throw new CustomError('As senhas não coincidem', 400);
        }

        try {
            // Verifica se o email já está cadastrado usando o método encapsulado
            const existingUser = await this.userRepository.findByEmail(email);

            // Lança um erro se o email já estiver cadastrado
            if (existingUser) {
                throw new CustomError('Email já cadastrado', 400);
            }

            // Cria o hash da senha
            const hashedPassword = await hashPassword(password);

            // Cria o novo usuário e salva no banco de dados
            const newUser = this.userRepository.create({
                name,
                email,
                password: hashedPassword // Armazena a senha já hashada
            });

            await this.userRepository.save(newUser);

            // Retorna uma resposta de sucesso sem expor dados sensíveis
            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: {
                    id: newUser.id,
                    email: newUser.email
                }
            });
        } catch (error) {
            // Trata o erro caso seja uma instância de CustomError
            if (error instanceof CustomError) {
                return res
                    .status(error.status)
                    .json({ message: error.message });
            }

            // Trata outros erros desconhecidos
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
}
