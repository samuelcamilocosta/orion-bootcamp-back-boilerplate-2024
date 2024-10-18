import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository'; // Substituído para usar o repositório
import { hashPassword } from '../library/bcrypt'; // Importação correta da função hash
import { generateToken } from '../library/jwt'; // Importação correta da função JWT

/**
 * Controlador para operações relacionadas aos usuários.
 */
export class UserController {
    /**
     * Função para criar um novo usuário.
     *
     * @param req - Objeto de requisição contendo os dados do usuário.
     * @param res - Objeto de resposta HTTP.
     * @returns Promise que resolve em uma resposta HTTP.
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const existingUser = await UserRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            const hashedPassword = await hashPassword(password);

            const newUser = UserRepository.create({
                name,
                email,
                password: hashedPassword
            });
            await UserRepository.save(newUser);

            const token = generateToken(
                { userId: newUser.id },
                process.env.JWT_SECRET!,
                '1h'
            );

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: newUser,
                token
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
}
