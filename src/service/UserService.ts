import { AuthService } from './AuthService';
import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';

export class UserService {
  static generateUserResponse(user: Tutor | Student, userType: 'tutor' | 'student') {
    const token = AuthService.generateToken(user.id, user.email, userType);
    return {
      user,
      token
    };
  }
}
