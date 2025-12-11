// Pagina de Gestao de Produtos (Bomboniere) - CRUD completo
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const CATEGORIAS = ['Pipoca', 'Bebida', 'Doce', 'Combo', 'Outros'];

function Produtos() {
    const [produtos, setProdutos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState(null);
    const [form, setForm] = useState({
        nome: '',
        categoria: 'Pipoca',
        preco: '',
        estoque: '0',
    });
    const [salvando, setSalvando] = useState(false);

    // Carregar produtos
    const carregarProdutos = async () => {
        try {
            const response = await api.get('/produtos');
            setProdutos(response.data);
        } catch (error) {
            toast.error('Erro ao carregar produtos');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarProdutos();
    }, []);

    // Icone da categoria
    const getIconeCategoria = (categoria) => {
        const icones = {
            Pipoca: '🍿',
            Bebida: '🥤',
            Doce: '🍫',
            Combo: '🎁',
            Outros: '📦',
        };
        return icones[categoria] || '📦';
    };

    // Abrir modal para criar
    const abrirModalCriar = () => {
        setEditando(null);
        setForm({ nome: '', categoria: 'Pipoca', preco: '', estoque: '0' });
        setModalAberto(true);
    };

    // Abrir modal para editar
    const abrirModalEditar = (produto) => {
        setEditando(produto.id);
        setForm({
            nome: produto.nome,
            categoria: produto.categoria,
            preco: produto.preco.toString(),
            estoque: produto.estoque.toString(),
        });
        setModalAberto(true);
    };

    // Fechar modal
    const fecharModal = () => {
        setModalAberto(false);
        setEditando(null);
        setForm({ nome: '', categoria: 'Pipoca', preco: '', estoque: '0' });
    };

    // Salvar (criar ou editar)
    const salvar = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.categoria || !form.preco) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        const preco = parseFloat(form.preco);
        if (isNaN(preco) || preco < 0) {
            toast.error('Preço deve ser um número positivo');
            return;
        }

        const estoque = parseInt(form.estoque) || 0;
        if (estoque < 0) {
            toast.error('Estoque não pode ser negativo');
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome,
                categoria: form.categoria,
                preco,
                estoque,
            };

            if (editando) {
                await api.put(`/produtos/${editando}`, dados);
                toast.success('Produto atualizado com sucesso!');
            } else {
                await api.post('/produtos', dados);
                toast.success('Produto criado com sucesso!');
            }

            fecharModal();
            carregarProdutos();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao salvar produto';
            toast.error(mensagem);
        } finally {
            setSalvando(false);
        }
    };

    // Excluir produto
    const excluir = async (id) => {
        if (!window.confirm('Deseja realmente excluir este produto?')) {
            return;
        }

        try {
            await api.delete(`/produtos/${id}`);
            toast.success('Produto excluído com sucesso!');
            carregarProdutos();
        } catch (error) {
            const mensagem = error.response?.data?.message || 'Erro ao excluir produto';
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

    // Agrupar produtos por categoria
    const produtosPorCategoria = CATEGORIAS.reduce((acc, cat) => {
        acc[cat] = produtos.filter(p => p.categoria === cat);
        return acc;
    }, {});

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h2>🍿 Bombonière</h2>
                        <p>Gerencie os produtos do cinema</p>
                    </div>
                    <button onClick={abrirModalCriar} className="btn btn-primary">
                        + Novo Produto
                    </button>
                </div>

                {carregando ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : produtos.length === 0 ? (
                    <div className="empty-state">
                        <span>🍿</span>
                        <h3>Nenhum produto cadastrado</h3>
                        <p>Clique em "Novo Produto" para adicionar</p>
                    </div>
                ) : (
                    <div className="produtos-container">
                        {CATEGORIAS.map((categoria) => {
                            const produtosCategoria = produtosPorCategoria[categoria];
                            if (produtosCategoria.length === 0) return null;

                            return (
                                <div key={categoria} className="categoria-section">
                                    <h3>{getIconeCategoria(categoria)} {categoria}</h3>
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Produto</th>
                                                    <th>Preço</th>
                                                    <th>Estoque</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {produtosCategoria.map((produto) => (
                                                    <tr key={produto.id}>
                                                        <td>{produto.nome}</td>
                                                        <td>{formatarPreco(produto.preco)}</td>
                                                        <td>
                                                            <span className={`estoque-badge ${produto.estoque < 10 ? 'baixo' : ''}`}>
                                                                {produto.estoque} un.
                                                            </span>
                                                        </td>
                                                        <td className="actions">
                                                            <button onClick={() => abrirModalEditar(produto)} className="btn btn-small btn-secondary">
                                                                ✏️ Editar
                                                            </button>
                                                            <button onClick={() => excluir(produto.id)} className="btn btn-small btn-danger">
                                                                🗑️ Excluir
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal de criar/editar */}
                {modalAberto && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editando ? 'Editar Produto' : 'Novo Produto'}</h3>
                                <button onClick={fecharModal} className="modal-close">&times;</button>
                            </div>

                            <form onSubmit={salvar} className="modal-body" autoComplete="off">
                                <div className="form-group">
                                    <label htmlFor="nome">Nome do Produto</label>
                                    <input
                                        type="text"
                                        id="nome"
                                        value={form.nome}
                                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                        placeholder="Ex: Pipoca Grande"
                                        disabled={salvando}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="categoria">Categoria</label>
                                    <select
                                        id="categoria"
                                        value={form.categoria}
                                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                                        disabled={salvando}
                                        required
                                    >
                                        {CATEGORIAS.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {getIconeCategoria(cat)} {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="preco">Preço (R$)</label>
                                        <input
                                            type="number"
                                            id="preco"
                                            value={form.preco}
                                            onChange={(e) => setForm({ ...form, preco: e.target.value })}
                                            placeholder="Ex: 15.00"
                                            min="0"
                                            step="0.01"
                                            disabled={salvando}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="estoque">Estoque</label>
                                        <input
                                            type="number"
                                            id="estoque"
                                            value={form.estoque}
                                            onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                                            placeholder="Ex: 50"
                                            min="0"
                                            disabled={salvando}
                                        />
                                    </div>
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

export default Produtos;
