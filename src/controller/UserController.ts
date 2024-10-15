import { Request, Response } from 'express';
import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {
    async createUser(req: Request, res: Response) {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            // Verifica se o email já existe
            const userRepository = MongoDataSource.getMongoRepository(User); // Use o repositório MongoDB
            const existingUser = await userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPassword;

            // Salva o novo usuário no banco de dados
            await userRepository.save(newUser);

            const token = jwt.sign(
                { userId: newUser.id },
                process.env.JWT_SECRET!,
                {
                    expiresIn: '1h'
                }
            );

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: newUser,
                token: token
            });
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Erro ao criar usuário', error });
        }
    }

    async getAllUsers(_req: Request, res: Response) {
        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const users = await userRepository.find();
            return res.status(200).json(users);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuários', error });
        }
    }

    async getUserById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const user = await userRepository.findOne({ where: { id } });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
        }
    }

    async getUserByEmail(req: Request, res: Response) {
        const { email } = req.params;

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
        }
    }
}
