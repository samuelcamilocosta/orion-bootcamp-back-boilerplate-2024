/**
 * Verifica se duas senhas são iguais.
 *
 * @param password - A senha original.
 * @param confirmPassword - A confirmação da senha.
 * @returns Verdadeiro se as senhas coincidirem, falso caso contrário.
 */
export const validatePasswords = (
    password: string,
    confirmPassword: string
): boolean => {
    return password === confirmPassword;
};
