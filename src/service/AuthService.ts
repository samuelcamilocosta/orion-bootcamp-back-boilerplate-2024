import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';

export class AuthService {
  static generateToken(id: number, email: string, role: string): string {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
      expiresIn: '8h'
    });
  }

  static verifyPassword = async (user: Tutor | Student, password: string) => {
    const isMatch = await bcrypt.compare(password, user.password);
    const role = user instanceof Tutor ? 'tutor' : 'aluno';
    return { isMatch, role };
  };

  static verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
  }
}
