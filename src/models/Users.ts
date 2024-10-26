import { Entity, Column, ObjectIdColumn, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

/**
 * Entidade User representando a tabela/coleção de usuários no MongoDB.
 */
@Entity('users')
export class User {
    @ObjectIdColumn()
    id: string; // Identificador único do usuário

    @Column()
    name: string; // Nome do usuário

    @Column({ unique: true, nullable: false })
    email: string; // E-mail do usuário, deve ser único e não pode ser nulo

    @Column()
    password: string; // Senha do usuário armazenada com hash

    @Column({ type: 'int', default: 0 })
    loginCount: number; // Número de logins realizados pelo usuário

    @Column({ type: 'date', nullable: true })
    lastLogin: Date; // Data e hora do último login do usuário

    @Column({ type: 'date', default: () => 'NOW()' })
    createdAt: Date; // Data de criação do usuário

    @BeforeInsert()
    validateEmail(): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            throw new Error('O e-mail fornecido está em um formato inválido.');
        }
    }

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        if (!this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}
