// Contexto de Tema - Gerencia tema claro/escuro
// Persiste escolha do usuario no localStorage

import React, { createContext, useState, useContext, useEffect } from 'react';

// Criar o contexto
const ThemeContext = createContext(null);

// Provider do contexto
export function ThemeProvider({ children }) {
    // Inicializa com tema do localStorage ou 'dark' como padrao
    const [tema, setTema] = useState(() => {
        const temaSalvo = localStorage.getItem('cinemanager-tema');
        return temaSalvo || 'dark';
    });

    // Atualiza o atributo data-theme no HTML quando tema muda
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('cinemanager-tema', tema);
    }, [tema]);

    // Funcao para alternar tema
    const alternarTema = () => {
        setTema(temaAtual => temaAtual === 'dark' ? 'light' : 'dark');
    };

    // Valor do contexto
    const value = {
        tema,
        alternarTema,
        isDark: tema === 'dark',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook customizado para usar o contexto
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
}

export default ThemeContext;
