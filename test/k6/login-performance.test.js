import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { BASE_URL } from './helpers/baseURL.js';
import { ENDPOINTS, DEFAULT_HEADERS } from './helpers/apiCalls.js';
import { generateRandomEmail, generatePassword, generateRandomName } from './helpers/randomData.js';

export const options = {
    vus: 1,
    duration: '1s',
    thresholds: {
        http_req_duration: ['p(90)<=15', 'p(95)<=20'],
        http_req_failed: ['rate<0.01'],
        'group_duration{group:::Fazendo login}': ['avg<300'],
        'group_duration{group:::Simulando o pensamento do usuário}': ['avg<1100']
    }
};

const users = new SharedArray('users', function () {
    return JSON.parse(open('./data/login.test.data.json'));
});

export default function () {
    let responseLogin = '';
    //const userData = users[__VU - 1];
    const userData = users[__VU % users.length];

    group('Fazendo login', function () {
        responseLogin = http.post(
            `${BASE_URL}${ENDPOINTS.AUTH.LOGIN}`,
            JSON.stringify({
                'email': userData.email,
                'password': userData.password
            }),
            {
                headers: DEFAULT_HEADERS
            });

        check(responseLogin, {
            'status deve ser igual a 200': (r) => r.status === 200
        });
    })

    group('Simulando o pensamento do usuário', function () {
        sleep(1); // User Think Time
    })
}