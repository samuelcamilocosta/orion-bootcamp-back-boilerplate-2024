import { Entity, Column, ObjectIdColumn, BeforeInsert } from 'typeorm';
import bcrypt from 'bcrypt';

/**
 * Expressão regular para validar o formato do e-mail.
 */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Entidade User representando a tabela/coleção de usuários no MongoDB.
 */
@Entity('users')
export class User {
  /**
   * Identificador único do usuário.
   * Usado como ObjectId no MongoDB.
   */
  @ObjectIdColumn()
  id: string;

  /**
   * Nome do usuário.
   */
  @Column()
  name: string;

  /**
   * E-mail do usuário.
   * Deve ser único e não pode ser nulo.
   */
  @Column({
    unique: true,
    nullable: false
  })
  email: string;

  /**
   * Senha do usuário armazenada com hash.
   */
  @Column()
  password: string;

  /**
   * Número de logins realizados pelo usuário.
   */
  @Column({ type: 'int', default: 0 })
  loginCount: number;

  /**
   * Data e hora do último login do usuário.
   */
  @Column({ type: 'date', nullable: true })
  lastLogin: Date;

  /**
   * Token para redefinição de senha.
   */
  @Column({ nullable: true })
  resetPasswordToken?: string;

  /**
   * Data de expiração do token de redefinição de senha.
   */
  @Column({ type: 'date', nullable: true })
  resetPasswordExpires?: Date;

  /**
   * Data de criação do usuário.
   * Valor padrão é a data/hora atual.
   */
  @Column({ type: 'date', default: () => 'NOW()' })
  createdAt: Date;

  /**
   * Valida o e-mail do usuário antes de inserir.
   * Lança um erro caso o e-mail não esteja em um formato válido.
   * 
   * @throws {Error} Se o formato do e-mail for inválido.
   */
  @BeforeInsert()
  validateEmail() {
    if (!emailRegex.test(this.email)) {
      throw new Error('O e-mail fornecido está em um formato inválido.');
    }
  }

  /**
   * Aplica hash à senha do usuário antes de inserir no banco de dados.
   * Gera um salt e aplica bcrypt caso a senha não esteja previamente criptografada.
   */
  @BeforeInsert()
  async hashPassword() {
    if (!this.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  /**
   * Compara a senha fornecida com a senha armazenada.
   * 
   * @param candidatePassword - Senha que será comparada à senha do usuário.
   * @returns Uma Promise que resolve em `true` se as senhas coincidirem ou `false` caso contrário.
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
