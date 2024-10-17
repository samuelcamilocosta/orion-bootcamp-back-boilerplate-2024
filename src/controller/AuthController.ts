import { Request, Response } from 'express';
import {
    loginUser,
    requestPasswordReset,
    resetPassword
} from '../services/AuthService';

interface CustomError extends Error {
    message: string;
}

// Controlador para login de usuário
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password); // Faz o login chamando loginUser do AuthService
        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        const customError = error as CustomError;

        // Verificação de erros personalizados
        if (customError.message === 'E-mail inválido') {
            return res.status(400).json({ error: customError.message });
        }

        if (customError.message === 'Senha incorreta') {
            return res.status(401).json({ error: customError.message });
        }

        // Erro genérico
        return res.status(500).json({
            error: 'Erro ao realizar login. Tente novamente mais tarde.'
        });
    }
};

// Controlador para solicitar redefinição de senha
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        // Tenta enviar o email de redefinição de senha
        await requestPasswordReset(email);
        res.status(200).json({
            message: 'Email de redefinição de senha enviado'
        });
    } catch (error) {
        const customError = error as CustomError;

        if (customError.message === 'Usuário não encontrado') {
            return res.status(404).json({ error: customError.message });
        }

        // Erro genérico
        return res.status(500).json({
            error: 'Erro ao processar solicitação. Tente novamente mais tarde.'
        });
    }
};

// Controlador para redefinir a senha
export const resetUserPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        // Tenta redefinir a senha do usuário
        await resetPassword(token, newPassword);
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
