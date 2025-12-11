// Servico de API centralizado
// Configura axios com credenciais para cookies HttpOnly

import axios from 'axios';

// Cria instancia do axios com configuracoes base
const api = axios.create({
    baseURL: 'http://localhost:3001/api', // URL do backend
    withCredentials: true, // IMPORTANTE: permite envio de cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se receber 401 (Não autorizado), redireciona para login
        if (error.response && error.response.status === 401) {
            // Limpa estado local se houver
            localStorage.removeItem('usuario');

            // Redireciona para login (se nao estiver ja na pagina de login)
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;