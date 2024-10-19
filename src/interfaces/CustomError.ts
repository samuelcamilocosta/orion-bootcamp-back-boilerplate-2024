/**
 * Classe CustomError que estende a classe base Error.
 * Usada para criar erros personalizados com status HTTP.
 */
export class CustomError extends Error {
  status: number;

  /**
   * Construtor para inicializar o erro customizado.
   *
   * @param message - Mensagem de erro descritiva.
   * @param status - Código de status HTTP (padrão: 400).
   */
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = 'CustomError';
  }
}
