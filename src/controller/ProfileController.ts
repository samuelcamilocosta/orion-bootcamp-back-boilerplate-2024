import { Request, Response } from 'express';
import { StudentRepository } from '../repositories/ProfileRepository';
import { UserRepository } from '../repositories/UserRepository';

/**
 * Controlador para as operações relacionadas aos alunos.
 */
export class StudentController {
  private studentRepository: StudentRepository;

  constructor() {
    this.studentRepository = new StudentRepository();
  }

  /**
   * Valida o formato da data de nascimento (DD/MM/AAAA).
   * @param date - Data de nascimento no formato DD/MM/AAAA.
   * @returns boolean - Retorna true se a data for válida, caso contrário, false.
   */
  private validateBirthDate(date: string): boolean {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (!dateRegex.test(date)) return false;

    const [day, month, year] = date.split('/').map(Number);
    const dateObject = new Date(year, month - 1, day);

    return (
      dateObject.getFullYear() === year &&
      dateObject.getMonth() === month - 1 &&
      dateObject.getDate() === day
    );
  }

  /**
   * Formata e valida o número de celular, garantindo 11 dígitos.
   * @param phone - O número de celular fornecido.
   * @returns string | null - O número formatado ou null se for inválido.
   */
  private formatPhoneNumber(phone: string): string | null {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) return null;

    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7,
    )}`;
  }

  /**
   * Cria um novo aluno associado a um usuário existente.
   * Realiza validações de data, escolaridade, tipo de escola, matérias e celular.
   *
   * @param req - Requisição HTTP contendo os dados do aluno.
   * @param res - Resposta HTTP.
   * @returns Resposta HTTP com o aluno criado ou erro.
   */
  async createStudent(req: Request, res: Response): Promise<Response> {
    const {
      userId,
      birthDate,
      educationLevel,
      schoolType,
      subjectsOfInterest,
      phoneNumber,
    } = req.body;

    try {
      // Validação da data de nascimento
      if (!this.validateBirthDate(birthDate)) {
        return res.status(400).json({
          message: 'Data inválida. Formato correto: DD/MM/AAAA.',
        });
      }

      // Validação do nível de escolaridade
      const validEducationLevels = [
        'Ensino Médio (1º ano)',
        'Ensino Médio (2º ano)',
        'Ensino Médio (3º ano)',
      ];
      if (!validEducationLevels.includes(educationLevel)) {
        return res.status(400).json({
          message:
            'Escolaridade inválida. Selecione uma das opções disponíveis.',
        });
      }

      // Validação do tipo de escola
      const validSchoolTypes = ['Escola Pública', 'Escola Privada'];
      if (!validSchoolTypes.includes(schoolType)) {
        return res.status(400).json({
          message:
            'Tipo de Escola inválido. Selecione uma das opções disponíveis.',
        });
      }

      // Validação das matérias de interesse
      const validSubjects = [
        'Língua Portuguesa',
        'Inglês',
        'Artes',
        'Educação Física',
        'Matemática',
        'Física',
        'Química',
        'Biologia',
        'História',
        'Geografia',
        'Filosofia',
        'Sociologia',
      ];
      if (
        !subjectsOfInterest.every((subject: string) =>
          validSubjects.includes(subject),
        )
      ) {
        return res.status(400).json({
          message: 'Uma ou mais matérias inválidas. Selecione opções válidas.',
        });
      }

      // Formatação e validação do número de celular
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      if (!formattedPhone) {
        return res.status(400).json({
          message: 'Número de celular inválido. Deve conter 11 dígitos.',
        });
      }

      // Verificar se o usuário existe usando o ID do usuário (userId)
      const user = await new UserRepository().findOne(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      // Criar e salvar o novo aluno vinculado ao userId
      const newStudent = this.studentRepository.create({
        userId,
        birthDate: new Date(birthDate.split('/').reverse().join('-')), // Converter para formato Date
        educationLevel,
        schoolType,
        subjectsOfInterest,
        phoneNumber: formattedPhone,
      });

      await this.studentRepository.save(newStudent);

      return res.status(201).json({
        message: 'Aluno cadastrado com sucesso',
        student: newStudent,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Erro ao cadastrar aluno',
        error: error.message,
      });
    }
  }
}
