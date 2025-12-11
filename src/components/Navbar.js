// Componente de navegacao
// Menu lateral com toggle de tema e logout

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';

function Navbar() {
    const { usuario, logout } = useAuth();
    const { isDark, alternarTema } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success('Logout realizado com sucesso!');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">🎬</span>
                <h1>CineManager</h1>
            </div>

            <ul className="navbar-menu">
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                        📊 Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/salas" className={({ isActive }) => isActive ? 'active' : ''}>
                        🎭 Salas
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/sessoes" className={({ isActive }) => isActive ? 'active' : ''}>
                        🎬 Sessões
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/produtos" className={({ isActive }) => isActive ? 'active' : ''}>
                        🍿 Bombonière
                    </NavLink>
                </li>
            </ul>

            <div className="navbar-user">
                {/* Botao de toggle de tema */}
                <button
                    onClick={alternarTema}
                    className="btn btn-theme-toggle"
                    title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
                >
                    {isDark ? '☀️' : '🌙'} {isDark ? 'Modo Dia' : 'Modo Noite'}
                </button>

                <span className="user-name">👤 {usuario?.nome || 'Usuário'}</span>
                <button onClick={handleLogout} className="btn btn-logout">
                    Sair
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
