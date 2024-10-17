import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
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
   *       '400':
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Senha incorreta."
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

      if (!isTutor && !isStudent) {
        return res.status(404).json({ message: 'Email não encontrado.' });
      }

      let isMatch = false;

      if (isTutor) {
        isMatch = await bcrypt.compare(password, isTutor.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Senha incorreta.' });
        }
      }

      if (isStudent) {
        isMatch = await bcrypt.compare(password, isStudent.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Senha incorreta.' });
        }
      }

      return res.status(200).json({ message: 'Login bem-sucedido.' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Internal Server Error.', error: error.message });
    }
  }
}
