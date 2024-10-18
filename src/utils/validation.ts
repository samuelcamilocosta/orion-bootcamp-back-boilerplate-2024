// src/utils/validation.ts

/**
 * Valida o formato de um e-mail utilizando uma expressão regular.
 *
 * Esta função é responsável por garantir que o e-mail fornecido siga o padrão adequado,
 * conforme especificado pela expressão regular `emailRegex`.
 *
 * @param email - O e-mail a ser validado.
 * @returns `true` se o e-mail estiver no formato correto, `false` caso contrário.
 */
export const validateEmail = (email: string): boolean => {
  // Expressão regular para verificar o formato de e-mails válidos
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
