// Componente de rota protegida
// Redireciona para login se usuario nao estiver autenticado

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated, carregando } = useAuth();
    const location = useLocation();

    // Mostra loading enquanto verifica autenticacao
    if (carregando) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Carregando...</p>
            </div>
        );
    }

    // Se nao estiver autenticado, redireciona para login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Se estiver autenticado, renderiza o conteudo
    return children;
}

export default PrivateRoute;
