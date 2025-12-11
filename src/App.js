// Componente principal com rotas
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Salas from './pages/Salas';
import Sessoes from './pages/Sessoes';
import Produtos from './pages/Produtos';

import './App.css';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Rotas publicas */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Rotas protegidas */}
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/salas" element={
                                <PrivateRoute>
                                    <Salas />
                                </PrivateRoute>
                            } />
                            <Route path="/sessoes" element={
                                <PrivateRoute>
                                    <Sessoes />
                                </PrivateRoute>
                            } />
                            <Route path="/produtos" element={
                                <PrivateRoute>
                                    <Produtos />
                                </PrivateRoute>
                            } />

                            {/* Redireciona para login por padrao */}
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>

                        {/* Container global de toasts */}
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
