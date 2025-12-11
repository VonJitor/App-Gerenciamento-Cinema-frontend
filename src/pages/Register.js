// Pagina de Registro
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validacao
        if (!nome || !email || !senha || !confirmarSenha) {
            toast.error('Preencha todos os campos');
            return;
        }

        if (senha.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (senha !== confirmarSenha) {
            toast.error('As senhas não coincidem');
            return;
        }

        setCarregando(true);

        try {
            await register(nome, email, senha);
            toast.success('Conta criada com sucesso! Faça login.');
            navigate('/login');
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao criar conta';
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
                    <p>Criar nova conta</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="nome">Nome</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome completo"
                            disabled={carregando}
                            required
                        />
                    </div>

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
                            placeholder="Mínimo 6 caracteres"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirmarSenha"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Repita a senha"
                            disabled={carregando}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={carregando}>
                        {carregando ? 'Criando conta...' : 'Criar Conta'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Já tem uma conta? <Link to="/login">Fazer login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;
