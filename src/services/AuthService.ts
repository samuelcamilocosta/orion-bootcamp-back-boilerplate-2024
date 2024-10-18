import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';
import { comparePassword } from '../library/bcrypt';

export class AuthService {
    /**
     * Função para login do usuário.
     */
    static async loginUser(email: string, password: string): Promise<User> {
        const userRepository = MongoDataSource.getMongoRepository(User);
        const user = await userRepository.findOneBy({ email });

        if (!user) {
            throw new Error('E-mail inválido');
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Senha incorreta');
        }

        user.loginCount = (user.loginCount || 0) + 1;
        user.lastLogin = new Date();
        await userRepository.save(user);

        return user;
    }
}
