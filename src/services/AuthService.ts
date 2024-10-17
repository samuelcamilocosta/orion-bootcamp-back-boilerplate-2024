import { User } from '../models/Users';
import { MongoDataSource } from '../config/database';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Função para login do usuário
export const loginUser = async (
    email: string,
    password: string
): Promise<User> => {
    const userRepository = MongoDataSource.getMongoRepository(User);

    // Buscar o usuário no banco de dados utilizando o email como critério
    console.log(`Buscando usuário com email: ${email}`);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
        console.log(`Usuário não encontrado para o email: ${email}`);
        throw new Error('E-mail inválido');
    }

    console.log(`Usuário encontrado: ${email}`);
    console.log(`Senha no banco (hash): ${user.password}`);
    console.log(`Senha fornecida: ${password}`);

    // Verificar se o bcrypt está sendo corretamente usado
    try {
        // Comparar a senha inserida com a senha armazenada criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        console.log(`Resultado da comparação bcrypt: ${isMatch}`);
        if (!isMatch) {
            console.log(`Senha incorreta para o usuário: ${email}`);
            throw new Error('Senha incorreta');
        }

        console.log(`Login bem-sucedido para o usuário: ${email}`);
    } catch (error) {
        console.error('Erro ao usar bcrypt.compare:', error);
        throw new Error('Erro ao verificar a senha.');
    }

    // Atualizar contadores de login e último login
    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLogin = new Date();

    // Salvar o usuário atualizado
    await userRepository.save(user);

    return user;
};

// Função para solicitar redefinição de senha
export const requestPasswordReset = async (email: string): Promise<void> => {
    const userRepository = MongoDataSource.getMongoRepository(User);
    console.log(`Buscando usuário para redefinir senha com email: ${email}`);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
        console.log(`Usuário não encontrado para redefinir senha: ${email}`);
        throw new Error('Usuário não encontrado');
    }

    // Geração do token de redefinição de senha
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(`Token de redefinição gerado para ${email}: ${resetToken}`);

    // Definir o token e a data de expiração (ex: 1 hora)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora de validade

    // Salvar o usuário atualizado
    await userRepository.save(user);

    // Configurar o serviço de email (exemplo usando nodemailer)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log(`Link de redefinição de senha: ${resetLink}`);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Redefinição de Senha',
        text: `Você solicitou uma redefinição de senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
    console.log(`Email de redefinição de senha enviado para: ${email}`);
};

// Função para redefinir a senha
export const resetPassword = async (
    token: string,
    newPassword: string
): Promise<void> => {
    const userRepository = MongoDataSource.getMongoRepository(User);
    console.log(`Buscando usuário para redefinir senha com token: ${token}`);

    const user = await userRepository.findOne({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() } // Verifica se o token não expirou
        }
    });

    if (!user) {
        console.log('Token inválido ou expirado');
        throw new Error('Token inválido ou expirado');
    }

    console.log(`Usuário encontrado para redefinir senha: ${user.email}`);
    console.log(`Atualizando senha para: ${newPassword}`);

    // Atualizar a senha do usuário
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Salvar o usuário atualizado
    await userRepository.save(user);
    console.log(`Senha redefinida com sucesso para: ${user.email}`);
};
