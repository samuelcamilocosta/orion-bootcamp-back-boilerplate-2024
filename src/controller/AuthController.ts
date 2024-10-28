import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';
import { Repository } from 'typeorm';

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
  public login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const studentRepository = MysqlDataSource.getRepository(Student);

      const user = await this.findUserByEmail(
        email,
        tutorRepository,
        studentRepository
      );
      const loginSuccess = 'Login bem-sucedido.';
      const incorrectPassword = 'Senha incorreta.';

      if (!user) {
        return res.status(404).json({ message: 'Email não encontrado.' });
      }

      const { isMatch, role } = await this.verifyPassword(user, password);
      if (!isMatch) {
        return res.status(400).json({ message: incorrectPassword });
      }

      const token = jwt.sign(
        { id: user!.id, email: user!.email, role },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
      );

      return res.status(200).json({ message: loginSuccess, role, token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error: error.message });
    }
  };

  private findUserByEmail = async (
    email: string,
    tutorRepository: Repository<Tutor>,
    studentRepository: Repository<Student>
  ) => {
    const user =
      (await tutorRepository.findOne({ where: { email } })) ||
      (await studentRepository.findOne({ where: { email } }));
    return user;
  };

  private verifyPassword = async (user: Tutor | Student, password: string) => {
    const isMatch = await bcrypt.compare(password, user.password);
    const role = user instanceof Tutor ? 'tutor' : 'aluno';
    return { isMatch, role };
  };
}
