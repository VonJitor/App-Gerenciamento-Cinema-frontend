// Pagina de Gestao de Sessoes - CRUD completo com calculo de precos
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

function Sessoes() {
    const [sessoes, setSessoes] = useState([]);
    const [salas, setSalas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({
        filme: '',
        horario_inicio: '',
        valor_ingresso_base: '',
        sala_id: '',
    });
    const [salvando, setSalvando] = useState(false);

    // Carregar dados
    const carregarDados = async () => {
        try {
            const [sessoesRes, salasRes] = await Promise.all([
                api.get('/sessoes'),
                api.get('/salas'),
            ]);
            setSessoes(sessoesRes.data);
            setSalas(salasRes.data);
        } catch (error) {
            toast.error('Erro ao carregar dados');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    // Formatar data para exibicao
    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Formatar data para input datetime-local
    const formatarDataInput = (dataISO) => {
        if (!dataISO) return '';
        const data = new Date(dataISO);
        return data.toISOString().slice(0, 16);
    };

    // Abrir modal para criar
    const abrirModalCriar = () => {
        if (salas.length === 0) {
            toast.warning('Cadastre pelo menos uma sala primeiro');
            return;
        }
        setEditando(null);
        setForm({
            filme: '',
            horario_inicio: '',
            valor_ingresso_base: '',
            sala_id: salas[0]?.id.toString() || '',
        });
        setModalAberto(true);
    };

    // Abrir modal para editar
    const abrirModalEditar = (sessao) => {
        setEditando(sessao.id);
        setForm({
            filme: sessao.filme,
            horario_inicio: formatarDataInput(sessao.horario_inicio),
            valor_ingresso_base: sessao.valor_ingresso_base.toString(),
            sala_id: sessao.sala_id.toString(),
        });
        setModalAberto(true);
    };

    // Fechar modal
    const fecharModal = () => {
        setModalAberto(false);
        setEditando(null);
        setForm({ filme: '', horario_inicio: '', valor_ingresso_base: '', sala_id: '' });
    };

    // Salvar (criar ou editar)
    const salvar = async (e) => {
        e.preventDefault();

        if (!form.filme || !form.horario_inicio || !form.valor_ingresso_base || !form.sala_id) {
            toast.error('Preencha todos os campos');
            return;
        }

        const valor = parseFloat(form.valor_ingresso_base);
        if (isNaN(valor) || valor < 0) {
            toast.error('Valor do ingresso deve ser um número positivo');
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                filme: form.filme,
                horario_inicio: new Date(form.horario_inicio).toISOString(),
                valor_ingresso_base: valor,
                sala_id: parseInt(form.sala_id),
            };

            if (editando) {
                await api.put(`/sessoes/${editando}`, dados);
                toast.success('Sessão atualizada com sucesso!');
            } else {
                await api.post('/sessoes', dados);
                toast.success('Sessão criada com sucesso!');
            }

            fecharModal();
            carregarDados();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao salvar sessão';
            toast.error(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    // Excluir sessao
    const excluir = async (id) => {
        if (!window.confirm('Deseja realmente excluir esta sessão?')) {
            return;
        }

        try {
            await api.delete(`/sessoes/${id}`);
            toast.success('Sessão excluída com sucesso!');
            carregarDados();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao excluir sessão';
            toast.error(mensagem);
        }
    };

    // Formatar preco
    const formatarPreco = (valor) => {
        return parseFloat(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h2>🎬 Sessões</h2>
                        <p>Gerencie as sessões de filmes</p>
                    </div>
                    <button onClick={abrirModalCriar} className="btn btn-primary">
                        + Nova Sessão
                    </button>
                </div>

                {carregando ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : sessoes.length === 0 ? (
                    <div className="empty-state">
                        <span>🎬</span>
                        <h3>Nenhuma sessão cadastrada</h3>
                        <p>Clique em "Nova Sessão" para adicionar</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {sessoes.map((sessao) => (
                            <div key={sessao.id} className="sessao-card">
                                <div className="sessao-header">
                                    <h3>{sessao.filme}</h3>
                                    <span className="sala-badge">{sessao.Sala?.nome || 'Sala removida'}</span>
                                </div>

                                <div className="sessao-info">
                                    <p><strong>📅 Horário:</strong> {formatarData(sessao.horario_inicio)}</p>
                                </div>

                                <div className="precos-container">
                                    <h4>Ingressos:</h4>
                                    <div className="precos-grid">
                                        <div className="preco-item inteira">
                                            <span className="preco-label">Inteira</span>
                                            <span className="preco-valor">{formatarPreco(sessao.precos.inteira)}</span>
                                        </div>
                                        <div className="preco-item meia">
                                            <span className="preco-label">Meia</span>
                                            <span className="preco-valor">{formatarPreco(sessao.precos.meia)}</span>
                                        </div>
                                        <div className="preco-item cortesia">
                                            <span className="preco-label">Cortesia</span>
                                            <span className="preco-valor">{formatarPreco(sessao.precos.cortesia)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="sessao-actions">
                                    <button onClick={() => abrirModalEditar(sessao)} className="btn btn-small btn-secondary">
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => excluir(sessao.id)} className="btn btn-small btn-danger">
                                        🗑️ Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal de criar/editar */}
                {modalAberto && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editando ? 'Editar Sessão' : 'Nova Sessão'}</h3>
                                <button onClick={fecharModal} className="modal-close">&times;</button>
                            </div>

                            <form onSubmit={salvar} className="modal-body" autoComplete="off">
                                <div className="form-group">
                                    <label htmlFor="filme">Título do Filme</label>
                                    <input
                                        type="text"
                                        id="filme"
                                        value={form.filme}
                                        onChange={(e) => setForm({ ...form, filme: e.target.value })}
                                        placeholder="Ex: Avatar 3"
                                        disabled={salvando}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="sala_id">Sala</label>
                                    <select
                                        id="sala_id"
                                        value={form.sala_id}
                                        onChange={(e) => setForm({ ...form, sala_id: e.target.value })}
                                        disabled={salvando}
                                        required
                                    >
                                        {salas.map((sala) => (
                                            <option key={sala.id} value={sala.id}>
                                                {sala.nome} ({sala.capacidade} lugares)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="horario_inicio">Data e Hora</label>
                                    <input
                                        type="datetime-local"
                                        id="horario_inicio"
                                        value={form.horario_inicio}
                                        onChange={(e) => setForm({ ...form, horario_inicio: e.target.value })}
                                        disabled={salvando}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="valor_ingresso_base">Valor do Ingresso (Inteira)</label>
                                    <input
                                        type="number"
                                        id="valor_ingresso_base"
                                        value={form.valor_ingresso_base}
                                        onChange={(e) => setForm({ ...form, valor_ingresso_base: e.target.value })}
                                        placeholder="Ex: 30.00"
                                        min="0"
                                        step="0.01"
                                        disabled={salvando}
                                        required
                                    />
                                    <small className="form-hint">
                                        Meia: {form.valor_ingresso_base ? formatarPreco(parseFloat(form.valor_ingresso_base) * 0.5) : 'R$ 0,00'}
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

export default Sessoes;
