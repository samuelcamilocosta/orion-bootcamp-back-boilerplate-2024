import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Serviço para lidar com a geração e verificação de tokens JWT.
 */
export class JwtService {
    /**
     * Gera um token JWT com o payload e as opções fornecidas.
     *
     * @param payload - O conteúdo a ser assinado no token.
     * @param secret - A chave secreta usada para assinar o token.
     * @param expiresIn - O tempo de expiração do token.
     * @returns O token JWT gerado.
     */
    static generateToken(
        payload: object,
        secret: string,
        expiresIn: string
    ): string {
        const options: SignOptions = { expiresIn };
        return jwt.sign(payload, secret, options);
    }

    /**
     * Verifica e decodifica um token JWT.
     *
     * @param token - O token JWT a ser verificado.
     * @param secret - A chave secreta usada para verificar o token.
     * @returns O payload decodificado ou uma exceção se for inválido.
     */
    static verifyToken(token: string, secret: string): object | string {
        return jwt.verify(token, secret);
    }
}
