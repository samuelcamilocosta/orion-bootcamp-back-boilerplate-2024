import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { UserRepository } from '../repository/UserRepository';

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
   *                 user:
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
    const { email, password } = req.body;

    try {
      const user = await UserRepository.findUserByEmail(email);
      const loginSuccess = 'Login bem-sucedido.';
      const incorrectCredentials = 'Email ou senha incorretos. Tente novamente.';

      if (!user) {
        return res.status(404).json({ message: incorrectCredentials });
      }

      const { isMatch, role } = await AuthService.verifyPassword(
        user,
        password
      );
      if (!isMatch) {
        return res.status(400).json({ message: incorrectCredentials });
      }

      const token = AuthService.generateToken(user.id, user.email, role);

      return res
        .status(200)
        .json({ message: loginSuccess, role: role, token: token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error: error.message });
    }
  };
}
