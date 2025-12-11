// Pagina de Login
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validacao simples
        if (!email || !senha) {
            toast.error('Preencha todos os campos');
            return;
        }

        setCarregando(true);

        try {
            await login(email, senha);
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao fazer login';
            toast.error(mensagem);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-logo">🎬</span>
                    <h1>CineManager</h1>
                    <p>Sistema de Gestão de Cinema</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Sua senha"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={carregando}>
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
