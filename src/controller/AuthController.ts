import { Request, Response } from 'express';
import { CustomError } from '../interfaces/CustomError';
import { AuthService } from '../services/AuthService';

/**
 * Função utilitária para lançar um erro personalizado.
 *
 * @param message - A mensagem do erro.
 * @param status - O código de status HTTP associado ao erro (opcional, padrão 400).
 * @throws {CustomError} - Lança um erro personalizado.
 */
export const throwCustomError = (
    message: string,
    status: number = 400
): never => {
    const error: CustomError = new Error(message);
    error.status = status;
    throw error;
};

// Controlador de autenticação
export class AuthController {
    /**
     * Função de login do usuário.
     */
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const token = await AuthService.loginUser(email, password);
            return res.status(200).json({ token });
        } catch (error) {
            const customError: CustomError = error as CustomError;
            return res
                .status(customError.status || 500)
                .json({ message: customError.message });
        }
    }
}
