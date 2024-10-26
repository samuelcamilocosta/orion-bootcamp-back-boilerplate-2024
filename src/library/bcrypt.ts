import bcrypt from 'bcrypt';

/**
 * Gera um salt para ser usado no hashing de senhas.
 *
 * @returns O salt gerado.
 */
export const generateSalt = async (): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.genSalt(saltRounds);
};

/**
 * Gera o hash de uma senha fornecida.
 *
 * @param password - A senha em texto puro.
 * @returns O hash da senha.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await generateSalt();
    return bcrypt.hash(password, salt);
};

/**
 * Compara uma senha fornecida com a senha criptografada armazenada.
 *
 * @param password - A senha fornecida pelo usuário.
 * @param hashedPassword - A senha armazenada no banco, já criptografada.
 * @returns Um booleano indicando se as senhas correspondem.
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
