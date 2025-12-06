/**
 * Gera um email aleatório único
 * @returns {string} Email aleatório no formato: user_TIMESTAMP_RANDOM@test.com
 */
export function generateRandomEmail() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `user_${timestamp}_${random}@test.com`;
}

/**
 * Gera uma senha padrão para testes
 * @returns {string} Senha para testes
 */
export function generatePassword() {
    return 'password123';
}

/**
 * Gera um nome de usuário aleatório
 * @returns {string} Nome aleatório
 */
export function generateRandomName() {
    const names = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Lucas', 'Julia', 'Rafael'];
    const surnames = ['Silva', 'Santos', 'Oliveira', 'Costa', 'Ferreira', 'Gomes', 'Martins'];

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];

    return `${randomName} ${randomSurname}`;
}