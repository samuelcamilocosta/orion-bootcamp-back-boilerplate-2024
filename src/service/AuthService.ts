import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { UserRepository } from '../repository/UserRepository';
import { EnumUserType } from '../entity/enum/EnumUserType';

export class AuthService {
  static async login(
    email: string,
    password: string,
    role: string,
    userType: string
  ) {
    const invalidCredentials = 'Credenciais inválidas.';
    if (!email || !password || !role || !userType) {
      throw new Error(invalidCredentials);
    }

    const user = await UserRepository.findUserByEmail(
      email,
      userType as EnumUserType
    );
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const { isMatch, roleFound } = await this.verifyPassword(user, password);
    if (!isMatch) {
      throw new Error(invalidCredentials);
    }

    if (role !== roleFound) {
      throw new Error(invalidCredentials);
    }

    const token = this.generateToken(user.id, user.email, role);
    return { userId: user.id, token, role: roleFound };
  }

  static generateToken(id: number, email: string, role: string): string {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET!, {
      expiresIn: '8h'
    });
  }

  static async verifyPassword(user: Tutor | Student, password: string) {
    const isMatch = await bcrypt.compare(password, user.password);
    const roleFound = user instanceof Tutor ? 'tutor' : 'student';
    return { isMatch, roleFound };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      email: string;
      role: string;
    };
  }
}
