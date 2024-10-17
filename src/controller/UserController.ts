import { Request, Response } from 'express';
import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

/**
 * Controlador para operações relacionadas aos usuários.
 */
export class UserController {
    /**
     * Função para criar um novo usuário.
     *
     * @param req - Objeto de requisição contendo os dados do usuário.
     * @param res - Objeto de resposta HTTP.
     * @returns Promise que resolve em uma resposta HTTP.
     */
    async createUser(req: Request, res: Response): Promise<Response> {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);

            const existingUser = await userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);

            const newUser = userRepository.create({
                name,
                email,
                password: hashedPassword
            });
            await userRepository.save(newUser);

            const token: string = jwt.sign(
                { userId: newUser.id },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: newUser,
                token
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }

    /**
     * Função para obter todos os usuários.
     *
     * @param _req - Objeto de requisição HTTP (não utilizado).
     * @param res - Objeto de resposta HTTP.
     * @returns Promise que resolve em uma resposta HTTP contendo todos os usuários.
     */
    async getAllUsers(_req: Request, res: Response): Promise<Response> {
        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const users = await userRepository.find();

            return res.status(200).json(users);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }

    /**
     * Função para obter um usuário pelo ID.
     *
     * @param req - Objeto de requisição contendo o ID do usuário.
     * @param res - Objeto de resposta HTTP.
     * @returns Promise que resolve em uma resposta HTTP com o usuário encontrado ou erro 404.
     */
    async getUserById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const user = await userRepository.findOne({
                where: { _id: new ObjectId(id) }
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }

            return res.status(200).json(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }

    /**
     * Função para obter um usuário pelo email.
     *
     * @param req - Objeto de requisição contendo o email do usuário.
     * @param res - Objeto de resposta HTTP.
     * @returns Promise que resolve em uma resposta HTTP com o usuário encontrado ou erro 404.
     */
    async getUserByEmail(req: Request, res: Response): Promise<Response> {
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro desconhecido' });
        }
    }
}
