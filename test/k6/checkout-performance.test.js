import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@8.3.1/+esm';
import { BASE_URL } from './helpers/baseURL.js';
import { ENDPOINTS, DEFAULT_HEADERS } from './helpers/apiCalls.js';

/**
 * Classe para gerenciar o registro e autenticação de usuários
 */
class UserAuthentication {
    constructor() {
        this.email = faker.internet.email();
        this.password = faker.internet.password({ length: 12 });
        this.name = faker.person.fullName();
        this.token = '';
    }

    /**
     * Registra um novo usuário na API
     * @returns {boolean} true se registrado com sucesso, false caso contrário
     */
    register() {
        const responseRegister = http.post(
            `${BASE_URL}${ENDPOINTS.AUTH.REGISTER}`,
            JSON.stringify({
                name: this.name,
                email: this.email,
                password: this.password
            }),
            {
                headers: DEFAULT_HEADERS
            });

        const isSuccessful = check(responseRegister, {
            'registro: status deve ser igual a 201 ou 200': (r) => r.status === 201 || r.status === 200,
            'registro: deve retornar dados do usuário': (r) => r.json('data.id') !== undefined || r.json('id') !== undefined
        });

        return isSuccessful;
    }

    /**
     * Faz login do usuário na API
     * @returns {boolean} true se logado com sucesso, false caso contrário
     */
    login() {
        const responseLogin = http.post(
            `${BASE_URL}${ENDPOINTS.AUTH.LOGIN}`,
            JSON.stringify({
                email: this.email,
                password: this.password
            }),
            {
                headers: DEFAULT_HEADERS
            });

        const isSuccessful = check(responseLogin, {
            'login: status deve ser igual a 200': (r) => r.status === 200,
            'login: deve retornar token': (r) => r.json('data.token') !== undefined
        });

        if (isSuccessful) {
            this.token = responseLogin.json('data.token');
        }

        return isSuccessful;
    }

    /**
     * Retorna o token do usuário autenticado
     */
    getToken() {
        return this.token;
    }
}

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<=2000']
    },
    stages: [
        { duration: '3s', target: 10 }, //Ramp-up
        { duration: '15s', target: 10 },//Average
        { duration: '2s', target: 100 }, //Spike
        { duration: '3s', target: 100 }, //Spike
        { duration: '5s', target: 10 }, //Average
        { duration: '5s', target: 0 }, //Ramp-down
    ]
};

export default function () {
    const user = new UserAuthentication();

    group('Registrando usuário', function () {
        user.register();
    })

    group('Fazendo login', function () {
        user.login();
    })

    group('Realizando checkout', function () {
        let responseCheckout = http.post(
            `${BASE_URL}${ENDPOINTS.CHECKOUT}`,
            JSON.stringify({
                items: [
                    {
                        productId: 1,
                        quantity: 2
                    },
                    {
                        productId: 2,
                        quantity: 1
                    }
                ],
                paymentMethod: 'credit_card'
            }),
            {
                headers: {
                    ...DEFAULT_HEADERS,
                    'Authorization': `Bearer ${user.getToken()}`
                }
            });

        check(responseCheckout, {
            'checkout: status deve ser igual a 200': (r) => r.status === 200,
            'checkout: deve retornar sucesso': (r) => r.json('success') === true
        });
    })

    group('Simulando o pensamento do usuário', function () {
        sleep(1); // User Think Time
    })
}