// Pagina de Gestao de Usuarios - CRUD completo
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

function Usuarios() {
    const { usuario: usuarioLogado } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({
        nome: '',
        email: '',
        senha: '',
    });
    const [salvando, setSalvando] = useState(false);

    // Carregar usuarios
    const carregarUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            toast.error('Erro ao carregar usuários');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    // Formatar data
    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR');
    };

    // Abrir modal para editar
    const abrirModalEditar = (usuario) => {
        setEditando(usuario.id);
        setForm({
            nome: usuario.nome,
            email: usuario.email,
            senha: '', // Senha vazia = nao alterar
        });
        setModalAberto(true);
    };

    // Fechar modal
    const fecharModal = () => {
        setModalAberto(false);
        setEditando(null);
        setForm({ nome: '', email: '', senha: '' });
    };

    // Salvar (editar)
    const salvar = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.email) {
            toast.error('Nome e email são obrigatórios');
            return;
        }

        if (form.senha && form.senha.length < 6) {
            toast.error('Senha deve ter no mínimo 6 caracteres');
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome,
                email: form.email,
            };

            // Só inclui senha se foi preenchida
            if (form.senha) {
                dados.senha = form.senha;
            }

            await api.put(`/usuarios/${editando}`, dados);
            toast.success('Usuário atualizado com sucesso!');

            fecharModal();
            carregarUsuarios();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao atualizar usuário';
            toast.error(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    // Excluir usuario
    const excluir = async (id) => {
        // Impedir excluir a si mesmo
        if (usuarioLogado && usuarioLogado.id === id) {
            toast.error('Você não pode excluir sua própria conta');
            return;
        }

        if (!window.confirm('Deseja realmente excluir este usuário?')) {
            return;
        }

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success('Usuário excluído com sucesso!');
            carregarUsuarios();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao excluir usuário';
            toast.error(mensagem);
        }
    };

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h2>👥 Usuários</h2>
                        <p>Gerencie os usuários do sistema</p>
                    </div>
                </div>

                {carregando ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : usuarios.length === 0 ? (
                    <div className="empty-state">
                        <span>👥</span>
                        <h3>Nenhum usuário cadastrado</h3>
                        <p>Use a página de registro para criar novos usuários</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Cadastro</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.id}</td>
                                        <td>
                                            {usuario.nome}
                                            {usuarioLogado && usuarioLogado.id === usuario.id && (
                                                <span className="badge-voce"> (você)</span>
                                            )}
                                        </td>
                                        <td>{usuario.email}</td>
                                        <td>{formatarData(usuario.createdAt)}</td>
                                        <td className="actions">
                                            <button
                                                onClick={() => abrirModalEditar(usuario)}
                                                className="btn btn-small btn-secondary"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() => excluir(usuario.id)}
                                                className="btn btn-small btn-danger"
                                                disabled={usuarioLogado && usuarioLogado.id === usuario.id}
                                            >
                                                🗑️ Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de editar */}
                {modalAberto && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Editar Usuário</h3>
                                <button onClick={fecharModal} className="modal-close">&times;</button>
                            </div>

                            <form onSubmit={salvar} className="modal-body" autoComplete="off">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        value={form.nome}
                                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                        placeholder="Nome completo"
                                        disabled={salvando}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="email@exemplo.com"
                                        disabled={salvando}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="senha">Nova Senha (opcional)</label>
                                    <input
                                        type="password"
                                        id="senha"
                                        value={form.senha}
                                        onChange={(e) => setForm({ ...form, senha: e.target.value })}
                                        placeholder="Deixe vazio para manter a atual"
                                        disabled={salvando}
                                        autoComplete="new-password"
                                    />
                                    <small className="form-hint">
                                        Deixe em branco para manter a senha atual
                                    </small>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" onClick={fecharModal} className="btn btn-secondary" disabled={salvando}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={salvando}>
                                        {salvando ? 'Salvando...' : 'Salvar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Usuarios;
