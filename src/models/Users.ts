import { Entity, Column, ObjectIdColumn, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

// Expressão regular para validar o formato do email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Entity('users') // Define a entidade para MongoDB
export class User {
    @ObjectIdColumn() // Usado para MongoDB
    id: string;

    @Column()
    name: string;

    @Column({
        unique: true,
        nullable: false
    })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'int', default: 0 })
    loginCount: number;

    @Column({ type: 'date', nullable: true })
    lastLogin: Date;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ type: 'date', nullable: true })
    resetPasswordExpires?: Date;

    @Column({ type: 'date', default: () => 'NOW()' })
    createdAt: Date;

    // Função para validar o e-mail antes de inserir
    @BeforeInsert()
    validateEmail() {
        if (!emailRegex.test(this.email)) {
            throw new Error('O e-mail fornecido está em um formato inválido.');
        }
    }

    // Função para hash da senha antes de inserir no banco
    @BeforeInsert()
    async hashPassword() {
        // Evitar recriptografia
        if (!this.password.startsWith('$2b$')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    // Método para comparar a senha armazenada com a fornecida
    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}
