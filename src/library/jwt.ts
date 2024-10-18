import jwt, { SignOptions } from 'jsonwebtoken';

/**
 * Classe responsável pela geração e validação de tokens JWT.
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
    expiresIn: string,
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, secret, options);
  }

  /**
   * Verifica se um token JWT é válido.
   *
   * @param token - O token JWT a ser verificado.
   * @param secret - A chave secreta usada para verificar o token.
   * @returns O payload decodificado se o token for válido.
   * @throws {Error} Se o token for inválido ou expirado.
   */
  static verifyToken(token: string, secret: string): object | string {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}
