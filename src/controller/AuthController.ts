import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export class AuthController {
  /**
   * @swagger
   * /api/login:
   *   post:
   *     summary: Login for Tutor or Student
   *     tags: [Auth]
   *     security: []
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
   *               role:
   *                 type: string
   *                 enum: [tutor, student]
   *                 description: Role of the user
   *                 example: "tutor"
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
   *                   example: "Login realizado com sucesso!"
   *                 userId:
   *                   type: integer
   *                   example: 1
   *                 role:
   *                   type: string
   *                   example: "tutor"
   *                 token:
   *                   type: string
   *                   description: JWT token for authenticated requests
   *       '400':
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Credenciais inválidas."
   *       '404':
   *         description: Email not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Credenciais inválidas."
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
    const { email, password, role } = req.body;

    try {
      const { userId, token, role: userRole } = await AuthService.login(email, password, role);

      return res.status(200).json({
        message: EnumSuccessMessages.LOGIN_SUCCESS,
        userId,
        role: userRole,
        token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  };
}
