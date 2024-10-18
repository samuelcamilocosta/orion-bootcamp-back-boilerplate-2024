import { Request, Response } from 'express';
import { CustomError } from '../interfaces/CustomError';
import { AuthService } from '../services/AuthService';

/**
 * Controlador de autenticação.
 */
export class AuthController {
  /**
   * Realiza o login do usuário, gerando e retornando o token JWT.
   *
   * @param req - Requisição contendo email e senha do usuário.
   * @param res - Resposta HTTP com o token JWT ou uma mensagem de erro.
   * @returns Resposta com o token JWT gerado ou erro.
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.loginUser(email, password);

      return res.status(200).json({
        message: 'Login bem-sucedido',
        token,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        // Mensagem genérica para erros de autenticação
        return res
          .status(error.status)
          .json({ message: 'Credenciais inválidas' });
      }
      return res.status(500).json({ message: 'Erro interno de servidor' });
    }
  }
}
