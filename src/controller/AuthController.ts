import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';

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
   *                   example: "Email não encontrado."
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
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const studentRepository = MysqlDataSource.getRepository(Student);

      const isTutor = await tutorRepository.findOne({ where: { email } });
      const isStudent = await studentRepository.findOne({ where: { email } });

      const incorrectPassword = 'Senha incorreta.';

      if (!isTutor && !isStudent) {
        return res.status(404).json({ message: 'Email não encontrado.' });
      }

      let isMatch = false;
      let user = null;
      let userType = '';
      const loginSuccess = 'Login bem-sucedido.';

      if (isTutor) {
        isMatch = await bcrypt.compare(password, isTutor.password);
        if (!isMatch) {
          return res.status(400).json({ message: incorrectPassword });
        }
        user = isTutor;
        userType = 'tutor';
      }

      if (isStudent) {
        isMatch = await bcrypt.compare(password, isStudent.password);
        if (!isMatch) {
          return res.status(400).json({ message: incorrectPassword });
        }
        user = isStudent;
        userType = 'student';
      }

      const token = jwt.sign(
        { id: user!.id, email: user!.email, userType },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );

      return res
        .status(200)
        .json({ message: loginSuccess, user: userType, token: token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error: error.message });
    }
  }
}
