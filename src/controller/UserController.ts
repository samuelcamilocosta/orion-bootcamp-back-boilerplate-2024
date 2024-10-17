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

        console.log('Tentando criar um usuário com email:', email);

        if (password !== confirmPassword) {
            console.log('As senhas não coincidem');
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);

            console.log('Verificando se o email já está cadastrado:', email);
            const existingUser = await userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                console.log('Email já cadastrado:', email);
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
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao criar usuário', error });
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
        } catch (error: any) {
            console.error('Erro ao buscar usuários:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuários', error });
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
        } catch (error: any) {
            console.error('Erro ao buscar usuário pelo ID:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
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
        } catch (error: any) {
            console.error('Erro ao buscar usuário pelo email:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
        }
    }
}
