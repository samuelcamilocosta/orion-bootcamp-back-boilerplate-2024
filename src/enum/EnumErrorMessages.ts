/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
export enum EnumErrorMessages {
  // System errors
  INTERNAL_SERVER = 'Erro interno do servidor.',

  // Authentication errors
  INVALID_CREDENTIALS = 'Credenciais inválidas.',
  INVALID_TOKEN = 'Token inválido.',
  MISSING_TOKEN = 'Acesso negado. Token não fornecido.',
  INSUFFICIENT_PERMISSION = 'Acesso negado. Permissão insuficiente.',

  // User errors
  USERNAME_ALREADY_EXISTS = 'Nome de usuário já cadastrado.',
  USERNAME_REQUIRED = 'Nome de usuário é obrigatório.',
  USERNAME_INVALID = 'Nome de usuário inválido.',
  EMAIL_ALREADY_EXISTS = 'Não foi possível concluir o cadastro. Verifique os dados inseridos.',
  EMAIL_REQUIRED = 'Email é obrigatório.',
  EMAIL_INVALID = 'Email inválido.',
  PASSWORD_REQUIRED = 'Senha é obrigatória.',
  PASSWORD_INVALID = 'Senha inválida.',
  PASSWORD_MIN_LENGTH = 'Senha deve ter no mínimo 6 caracteres.',
  PASSWORD_REQUIREMENTS = 'A senha deve ter ao menos 1 letra maiúscula, 1 número e 1 caractere especial.',
  CONFIRM_PASSWORD_REQUIRED = 'Confirmação de senha é obrigatória.',
  CONFIRM_PASSWORD_INVALID = 'Confirmação de senha inválida.',
  PASSWORDS_NOT_MATCH = 'As senhas não coincidem.',
  FULL_NAME_REQUIRED = 'Nome completo é obrigatório.',
  FULL_NAME_INVALID = 'Nome completo inválido.',

  // Tutor errors
  TUTOR_NOT_FOUND = 'Tutor não encontrado.',
  TUTOR_ID_REQUIRED = 'ID do tutor é obrigatório.',
  TUTOR_ID_INVALID = 'ID do tutor deve ser um número.',
  CPF_ALREADY_EXISTS = 'Não foi possível concluir o cadastro. Verifique os dados inseridos.',
  CPF_REQUIRED = 'CPF é obrigatório.',
  CPF_INVALID = 'CPF inválido.',
  EXPERTISE_LENGTH_EXCEEDED = 'A expertise deve ter no máximo 50 caracteres.',
  PROJECT_REASON_LENGTH_EXCEEDED = 'O motivo do projeto deve ter no máximo 200 caracteres.',

  // Student errors
  STUDENT_NOT_FOUND = 'Aluno não encontrado.',
  STUDENT_ID_REQUIRED = 'O Id do aluno é obrigatório.',
  STUDENT_ID_INVALID = 'O Id do aluno deve ser um número.',
  STUDENT_REGISTRATION_ERROR = 'Não foi possível concluir o cadastro do aluno. Verifique os dados inseridos.',

  // Subject errors
  SUBJECT_NOT_FOUND = 'Matéria não encontrada.',
  SUBJECT_ID_REQUIRED = 'O Id da matéria é obrigatório.',
  SUBJECT_ID_INVALID = 'O Id da matéria deve ser um número.',

  // Lesson errors
  LESSON_REQUEST_NOT_FOUND = 'Aula não encontrada.',
  EXISTING_LESSON = 'Já existe uma aula agendada para o aluno nesse horário: ${date}',
  REASON_REQUIRED = 'Motivo da aula é obrigatório.',
  REASON_INVALID = 'Motivo da aula inválido. Deve conter ao menos um desses: ${validReasons}',
  PREFERRED_DATES_REQUIRED = 'Datas preferidas são obrigatórias. Mínimo de 1 e máximo de 3.',
  ADDITIONAL_INFO_STRING = 'Informações adicionais devem ser uma string.',
  ADDITIONAL_INFO_LENGTH = 'Informações adicionais deve ter no máximo 200 caracteres.',
  INVALID_PENDENTE_STATUS = 'O status do pedido de aula deve estar como pendente.',
  INVALID_PENDENTE_ACEITO_STATUS = 'O status do pedido de aula deve estar como pendente ou como aceito.',
  TUTOR_ALREADY_ADDED = 'O tutor já está na lista de tutores do pedido de aula.',

  // Education level errors
  EDUCATION_LEVEL_NOT_FOUND = 'Nível de ensino não encontrado.',
  EDUCATION_LEVEL_REQUIRED = 'Níveis de ensino são obrigatórios.',
  EDUCATION_LEVEL_INVALID = 'Nível de ensino inválido.',
  EDUCATION_LEVEL_SINGLE = 'Somente um nível de ensino é permitido para educationLevelId.',
  EDUCATION_LEVEL_CONFLICT = 'Não é permitido o envio de educationLevelId e educationLevelIds simultaneamente.',
  EDUCATION_LEVEL_NOT_EXIST = 'Um ou mais níveis de ensino não existem.',

  // Date and time errors
  BIRTH_DATE_REQUIRED = 'Data de nascimento é obrigatória.',
  BIRTH_DATE_INVALID = 'Data de nascimento inválida.',
  BIRTH_DATE_FORMAT = 'Data de nascimento deve estar no formato DD/MM/YYYY.',
  BIRTH_DATE_INCORRECT = 'Data de nascimento incorreta, verifique a data inserida.',
  BIRTH_DATE_FUTURE = 'Data de nascimento não pode ser uma data futura.',
  DATE_FORMAT_INVALID = 'Data inválida. O formato correto é dd/MM/yyyy às HH:mm.',
  DATE_INVALID = 'Data inválida. Verifique se a data existe.',
  PREFERRED_DATES_INVALID = 'Datas preferidas são inválidas.',
  DUPLICATE_PREFERRED_DATES = 'Datas preferidas não podem ser duplicadas.',
  PAST_DATE_ERROR = 'A data e hora não podem ser no passado. ${date}',
  TIME_INVALID = 'A aula não pode ser agendada antes de 00:00 e depois de 23:59. Horário escolhido: ${time}',

  // Photo upload errors
  INVALID_FILE_TYPE = 'A imagem deve ser do tipo jpg.',
  FILE_TOO_LARGE = 'A imagem deve ter no máximo 5MB.',
  PHOTO_REQUIRED = 'A foto é obrigatória.',

  // Character length validation errors
  INVALID_CHAR_LENGTH = 'Quantidade inválida de caracteres.'
}
/* eslint-enable @typescript-eslint/no-duplicate-enum-values */
