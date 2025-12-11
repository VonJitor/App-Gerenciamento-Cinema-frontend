// Pagina de Gestao de Salas - CRUD completo
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

function Salas() {
    const [salas, setSalas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({ nome: '', capacidade: '' });
    const [salvando, setSalvando] = useState(false);

    // Carregar salas
    const carregarSalas = async () => {
        try {
            const response = await api.get('/salas');
            setSalas(response.data);
        } catch (error) {
            toast.error('Erro ao carregar salas');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarSalas();
    }, []);

    // Abrir modal para criar
    const abrirModalCriar = () => {
        setEditando(null);
        setForm({ nome: '', capacidade: '' });
        setModalAberto(true);
    };

    // Abrir modal para editar
    const abrirModalEditar = (sala) => {
        setEditando(sala.id);
        setForm({ nome: sala.nome, capacidade: sala.capacidade.toString() });
        setModalAberto(true);
    };

    // Fechar modal
    const fecharModal = () => {
        setModalAberto(false);
        setEditando(null);
        setForm({ nome: '', capacidade: '' });
    };

    // Salvar (criar ou editar)
    const salvar = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.capacidade) {
            toast.error('Preencha todos os campos');
            return;
        }

        const capacidade = parseInt(form.capacidade);
        if (isNaN(capacidade) || capacidade < 1) {
            toast.error('Capacidade deve ser um número maior que 0');
            return;
        }

        setSalvando(true);

        try {
            const dados = { nome: form.nome, capacidade };

            if (editando) {
                await api.put(`/salas/${editando}`, dados);
                toast.success('Sala atualizada com sucesso!');
            } else {
                await api.post('/salas', dados);
                toast.success('Sala criada com sucesso!');
            }

            fecharModal();
            carregarSalas();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao salvar sala';
            toast.error(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    // Excluir sala
    const excluir = async (id) => {
        if (!window.confirm('Deseja realmente excluir esta sala?')) {
            return;
        }

        try {
            await api.delete(`/salas/${id}`);
            toast.success('Sala excluída com sucesso!');
            carregarSalas();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao excluir sala';
            toast.error(mensagem);
        }
    };

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h2>🎭 Salas</h2>
                        <p>Gerencie as salas do cinema</p>
                    </div>
                    <button onClick={abrirModalCriar} className="btn btn-primary">
                        + Nova Sala
                    </button>
                </div>

                {carregando ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : salas.length === 0 ? (
                    <div className="empty-state">
                        <span>🎭</span>
                        <h3>Nenhuma sala cadastrada</h3>
                        <p>Clique em "Nova Sala" para adicionar</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Capacidade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salas.map((sala) => (
                                    <tr key={sala.id}>
                                        <td>{sala.id}</td>
                                        <td>{sala.nome}</td>
                                        <td>{sala.capacidade} lugares</td>
                                        <td className="actions">
                                            <button onClick={() => abrirModalEditar(sala)} className="btn btn-small btn-secondary">
                                                ✏️ Editar
                                            </button>
                                            <button onClick={() => excluir(sala.id)} className="btn btn-small btn-danger">
                                                🗑️ Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de criar/editar */}
                {modalAberto && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editando ? 'Editar Sala' : 'Nova Sala'}</h3>
                                <button onClick={fecharModal} className="modal-close">&times;</button>
                            </div>

                            <form onSubmit={salvar} className="modal-body" autoComplete="off">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome da Sala</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        value={form.nome}
                                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                        placeholder="Ex: Sala 1, IMAX, VIP"
                                        disabled={salvando}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="capacidade">Capacidade (lugares)</label>
                                    <input
                                        type="number"
                                        id="capacidade"
                                        value={form.capacidade}
                                        onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
                                        placeholder="Ex: 100"
                                        min="1"
                                        disabled={salvando}
                                        required
                                    />
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

export default Salas;
