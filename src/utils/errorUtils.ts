import { CustomError } from '../interfaces/CustomError';

/**
 * Lança um erro personalizado com base em uma mensagem e código de status.
 *
 * @param message - A mensagem do erro.
 * @param status - O código de status HTTP associado ao erro (opcional, padrão 400).
 * @throws {CustomError} - Lança um erro personalizado com status e mensagem.
 */
export const throwCustomError = (
    message: string,
    status: number = 400
): never => {
    throw new CustomError(message, status);
};
