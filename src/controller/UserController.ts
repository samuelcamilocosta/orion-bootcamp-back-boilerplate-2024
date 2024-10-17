import { Request, Response } from 'express';
import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export class UserController {
    // Função para criar um usuário
    async createUser(req: Request, res: Response) {
        const { name, email, password, confirmPassword } = req.body;

        console.log('Tentando criar um usuário com email:', email);

        if (password !== confirmPassword) {
            console.log('As senhas não coincidem');
            return res.status(400).json({ message: 'As senhas não coincidem' });
        }

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);

            // Verifica se o email já existe
            console.log('Verificando se o email já está cadastrado:', email);
            const existingUser = await userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                console.log('Email já cadastrado:', email);
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Criptografa a senha usando bcrypt
            console.log('Senha antes da criptografia:', password);
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log('Senha criptografada:', hashedPassword);

            const newUser = new User();
            newUser.name = name;
            newUser.email = email;
            newUser.password = hashedPassword;

            // Salva o novo usuário no banco de dados
            console.log(
                'Senha final antes de salvar no banco:',
                newUser.password
            ); // Verifique aqui
            await userRepository.save(newUser);
            const savedUser = await userRepository.findOne({
                where: { email }
            });
            console.log(
                'Usuário salvo no banco com a senha:',
                savedUser?.password
            ); // E logo após salvar

            // Gera um token JWT
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
            console.log('Erro ao criar usuário:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao criar usuário', error });
        }
    }

    // Função para obter todos os usuários
    async getAllUsers(_req: Request, res: Response) {
        try {
            console.log('Buscando todos os usuários');
            const userRepository = MongoDataSource.getMongoRepository(User);
            const users = await userRepository.find();
            console.log('Usuários encontrados:', users);
            return res.status(200).json(users);
        } catch (error) {
            console.log('Erro ao buscar usuários:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuários', error });
        }
    }

    // Função para obter usuário pelo ID
    async getUserById(req: Request, res: Response) {
        const { id } = req.params;
        console.log('Buscando usuário pelo ID:', id); // Log do ID buscado
        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const user = await userRepository.findOne({
                where: { _id: new ObjectId(id) }
            });
            console.log('Usuário encontrado:', user); // Log do usuário encontrado
            if (!user) {
                console.log('Usuário não encontrado com o ID:', id);
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.log('Erro ao buscar usuário pelo ID:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
        }
    }

    // Função para obter usuário pelo email
    async getUserByEmail(req: Request, res: Response) {
        const { email } = req.params;
        console.log('Buscando usuário pelo email:', email); // Log do email buscado

        try {
            const userRepository = MongoDataSource.getMongoRepository(User);
            const user = await userRepository.findOne({ where: { email } });
            console.log('Usuário encontrado pelo email:', user); // Log do usuário encontrado
            if (!user) {
                console.log('Usuário não encontrado com o email:', email);
                return res
                    .status(404)
                    .json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.log('Erro ao buscar usuário pelo email:', error);
            return res
                .status(500)
                .json({ message: 'Erro ao buscar usuário', error });
        }
    }
}
