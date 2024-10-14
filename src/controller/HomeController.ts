import { Request, Response } from 'express';
import { User } from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Função para validar o formato do e-mail
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export class HomeController {
  hello(_req: Request, res: Response) {
    return res.status(200).json({ message: 'Hello' });
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password, confirmPassword } = req.body;

    // Validação do formato do e-mail
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Formato de e-mail inválido' });
    }

    // Verifica se as senhas são iguais
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'As senhas não coincidem' });
    }

    try {
      // Verifica se o email já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criptografar a senha usando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      // Cria novo usuário
      const newUser = new User({ name, email, password: hashedPassword });

      // Salva o novo usuário no banco de dados
      await newUser.save();

      // Log para verificar o conteúdo do usuário após salvar
      console.log('Usuário salvo no banco:', newUser);

      // Gera o token JWT
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
        expiresIn: '1h'
      });

      // Log para verificar o token gerado
      console.log('Token JWT gerado:', token);

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: newUser,
        token: token
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
  }

  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await User.find();
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
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar usuário', error });
    }
  }
}
