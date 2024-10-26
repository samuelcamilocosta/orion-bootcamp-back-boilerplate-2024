import { MongoRepository } from 'typeorm';
import { Student } from '../models/profile/Profiles';
import { MongoDataSource } from '../config/database';

/**
 * Repositório da entidade Student para encapsular o acesso aos dados.
 */
export class StudentRepository {
    private repository: MongoRepository<Student>;

    constructor() {
        this.repository = MongoDataSource.getMongoRepository(Student);
    }

    /**
     * Cria uma instância de Student sem salvar no banco.
     *
     * @param studentData - Os dados do aluno.
     * @returns A instância do aluno criada.
     */
    create(studentData: Partial<Student>): Student {
        return this.repository.create(studentData);
    }

    /**
     * Salva um novo aluno no banco de dados.
     *
     * @param student - O aluno a ser salvo.
     * @returns O aluno salvo.
     */
    async save(student: Student): Promise<Student> {
        return this.repository.save(student);
    }

    /**
     * Encontra um aluno pelo ID do usuário associado.
     *
     * @param userId - O ID do usuário associado ao aluno.
     * @returns Uma Promise que resolve no aluno encontrado ou undefined.
     */
    async findByUserId(userId: string): Promise<Student | undefined> {
        return this.repository.findOne({ where: { userId } });
    }
}
