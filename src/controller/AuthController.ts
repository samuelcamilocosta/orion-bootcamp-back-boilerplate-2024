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

// Controlador para login de usuário
export class AuthController {
    // Função de login
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

    // Função para redefinição de senha
    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;
            await AuthService.requestPasswordReset(email);
            return res
                .status(200)
                .json({ message: 'Password reset email sent.' });
        } catch (error) {
            const customError: CustomError = error as CustomError;
            return res
                .status(customError.status || 500)
                .json({ message: customError.message });
        }
    }
}

// Controlador para redefinir a senha
export const resetUserPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        // Tenta redefinir a senha do usuário
        await AuthService.resetPassword(token, newPassword);
        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        const customError = error as CustomError;

        if (customError.message === 'Token inválido ou expirado') {
            return res.status(400).json({ error: customError.message });
        }

        // Erro genérico
        return res.status(500).json({
            error: 'Erro ao redefinir a senha. Tente novamente mais tarde.'
        });
    }
};
