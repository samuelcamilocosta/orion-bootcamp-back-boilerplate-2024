import { Request, Response } from 'express';
import { HomeController } from '../controller/HomeController';
import { User } from '../models/Users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mocks
jest.mock('../models/Users');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const homeController = new HomeController();

let req: Partial<Request>;
let res: Partial<Response>;

beforeEach(() => {
    req = {
        body: {}
    };

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
});

describe('HomeController', () => {
    it('deve retornar Hello na rota GET /', () => {
        homeController.hello(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Hello' });
    });

    it('deve retornar erro quando os e-mails não são válidos', async () => {
        req.body = {
            name: 'John Doe',
            email: 'invalid-email',
            password: 'password123',
            confirmPassword: 'password123'
        };

        await homeController.createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Formato de e-mail inválido'
        });
    });

    it('deve retornar erro quando as senhas não coincidem', async () => {
        req.body = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            confirmPassword: 'password456'
        };

        await homeController.createUser(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: 'As senhas não coincidem'
        });
    });

    it('deve criar um usuário e retornar um token JWT', async () => {
        req.body = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            confirmPassword: 'password123'
        };

        // Mock para o bcrypt e o modelo de usuário
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (User.findOne as jest.Mock).mockResolvedValue(null);

        // Mock do método `save` para retornar o usuário corretamente
        const mockSave = (User.prototype.save as jest.Mock).mockResolvedValue({
            _id: 'userId',
            name: 'John Doe',
            email: 'john@example.com'
        });

        // Mock do jwt.sign para retornar o token falso
        const mockSign = (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

        await homeController.createUser(req as Request, res as Response);

        // Verifique se o método save foi chamado e se o usuário foi salvo corretamente
        expect(mockSave).toHaveBeenCalled();

        // Verifique se a resposta contém os dados do usuário
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuário criado com sucesso',
            user: expect.objectContaining({
                name: 'John Doe',
                email: 'john@example.com'
            }),
            token: 'mockedToken' // O token deve ser retornado após o usuário ser salvo
        });

        // Verifique se o jwt.sign foi chamado após o usuário ser salvo
        expect(mockSign).toHaveBeenCalledWith(
            { userId: 'userId' },
            expect.any(String),
            { expiresIn: '1h' }
        );
    });
});
