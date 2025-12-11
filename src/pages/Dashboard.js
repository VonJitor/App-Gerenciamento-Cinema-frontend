// Pagina Dashboard - Pagina inicial apos login
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';

function Dashboard() {
    const [stats, setStats] = useState({
        salas: 0,
        sessoes: 0,
        produtos: 0,
    });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [salasRes, sessoesRes, produtosRes] = await Promise.all([
                    api.get('/salas'),
                    api.get('/sessoes'),
                    api.get('/produtos'),
                ]);

                setStats({
                    salas: salasRes.data.length,
                    sessoes: sessoesRes.data.length,
                    produtos: produtosRes.data.length,
                });
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, []);

    return (
        <div className="app-layout">
            <Navbar />

            <main className="main-content">
                <div className="page-header">
                    <h2>Dashboard</h2>
                    <p>Bem-vindo ao CineManager - Sistema de Gestão de Cinema</p>
                </div>

                {carregando ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Carregando...</p>
                    </div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <Link to="/salas" className="stat-card stat-salas">
                                <div className="stat-icon">🎭</div>
                                <div className="stat-info">
                                    <h3>{stats.salas}</h3>
                                    <p>Salas</p>
                                </div>
                            </Link>

                            <Link to="/sessoes" className="stat-card stat-sessoes">
                                <div className="stat-icon">🎬</div>
                                <div className="stat-info">
                                    <h3>{stats.sessoes}</h3>
                                    <p>Sessões</p>
                                </div>
                            </Link>

                            <Link to="/produtos" className="stat-card stat-produtos">
                                <div className="stat-icon">🍿</div>
                                <div className="stat-info">
                                    <h3>{stats.produtos}</h3>
                                    <p>Produtos</p>
                                </div>
                            </Link>
                        </div>

                        <div className="quick-actions">
                            <h3>Ações Rápidas</h3>
                            <div className="actions-grid">
                                <Link to="/salas" className="action-card">
                                    <span>➕</span>
                                    <p>Nova Sala</p>
                                </Link>
                                <Link to="/sessoes" className="action-card">
                                    <span>🎥</span>
                                    <p>Nova Sessão</p>
                                </Link>
                                <Link to="/produtos" className="action-card">
                                    <span>🥤</span>
                                    <p>Novo Produto</p>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;
