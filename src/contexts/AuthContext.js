// Contexto de autenticacao
// Gerencia estado de login/logout em toda a aplicacao

import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Criar o contexto
const AuthContext = createContext(null);

// Provider do contexto
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    // Verificar se usuario ja esta logado ao iniciar
    useEffect(() => {
        const verificarAuth = async () => {
            try {
                // Tenta buscar dados do usuario logado
                const response = await api.get('/auth/me');
                setUsuario(response.data);
            } catch (error) {
                // Se der erro 401, usuario nao esta logado
                setUsuario(null);
            } finally {
                setCarregando(false);
            }
        };

        verificarAuth();
    }, []);

    // Funcao de login
    const login = async (email, senha) => {
        const response = await api.post('/auth/login', { email, senha });
        setUsuario(response.data.usuario);
        return response.data;
    };

    // Funcao de registro
    const register = async (nome, email, senha) => {
        const response = await api.post('/auth/register', { nome, email, senha });
        return response.data;
    };

    // Funcao de logout
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            setUsuario(null);
        }
    };

    // Valor do contexto
    const value = {
        usuario,
        carregando,
        login,
        register,
        logout,
        isAuthenticated: !!usuario,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

export default AuthContext;
