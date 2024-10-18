import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Gera um token JWT com o payload e as opções fornecidas.
 *
 * @param payload - O conteúdo a ser assinado no token.
 * @param secret - A chave secreta usada para assinar o token.
 * @param expiresIn - O tempo de expiração do token.
 * @returns O token JWT gerado.
 */
export const generateToken = (
    payload: object,
    secret: string,
    expiresIn: string
): string => {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
};
