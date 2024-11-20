import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { UserRepository } from '../repository/UserRepository';
import { EnumUserType } from '../enum/EnumUserType';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export class AuthService {
  static async login(email: string, password: string, role: string) {
    try {
      if (!email || !password || !role) {
        throw new AppError(EnumErrorMessages.INVALID_CREDENTIALS, 400);
      }

      const user = await UserRepository.findUserByEmail(
        email,
        role as EnumUserType
      );
      if (!user) {
        throw new AppError(EnumErrorMessages.INVALID_CREDENTIALS, 404);
      }

      const { isMatch, roleFound } = await this.verifyPassword(user, password);
      if (!isMatch) {
        throw new AppError(EnumErrorMessages.INVALID_CREDENTIALS, 400);
      }

      if (role !== roleFound) {
        throw new AppError(EnumErrorMessages.INVALID_CREDENTIALS, 400);
      }

      const token = this.generateToken(user.id, user.email, role);
      return { userId: user.id, token, role: roleFound };
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
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
