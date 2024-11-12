import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';

export class AuthController {
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Login for Tutor or Student
   *     tags: [Auth]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email address of the user (Tutor or Student)
   *                 example: "usuario_tutor@exemplo.com"
   *               password:
   *                 type: string
   *                 description: Password of the user
   *                 example: "senhA@123"
   *     responses:
   *       '200':
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Login bem-sucedido."
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 role:
   *                   type: string
   *                   example: "aluno"
   *                 token:
   *                   type: string
   *                   description: JWT token for authenticated requests
   *       '400':
   *         description: Invalid credentials or validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                    errors:
   *                     type: array
   *                     items:
   *                      type: object
   *                      properties:
   *                        type:
   *                          type: string
   *                          example: "field"
   *                        value:
   *                          type: string
   *                          example: ""
   *                        msg:
   *                          type: string
   *                          example: "Email é obrigatório."
   *                        path:
   *                          type: string
   *                          example: "email"
   *                        location:
   *                          type: string
   *                          example: "body"
   *       '404':
   *         description: Email not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Email ou senha incorretos. Tente novamente."
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno do servidor."
   *                 error:
   *                   type: string
   */
  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, role, userType } = req.body;

    try {
      const {
        userId,
        token,
        role: userRole
      } = await AuthService.login(email, password, role, userType);

      return res.status(200).json({
        message: 'Login bem-sucedido.',
        userId: userId,
        role: userRole,
        token: token
      });
    } catch (error) {
      const errorMessage = error.message;

      if (errorMessage === 'Credenciais inválidas.') {
        return res.status(400).json({
          message: 'Email ou senha incorretos. Tente novamente.'
        });
      }
      if (errorMessage === 'Usuário não encontrado.') {
        return res.status(404).json({
          message: 'Email ou senha incorretos. Tente novamente.'
        });
      }
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error: errorMessage });
    }
  };
}
