/**
 * Obtém a URL base da API através de variável de ambiente
 * @returns {string} URL base configurada ou http://localhost:3000 como padrão
 */
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
