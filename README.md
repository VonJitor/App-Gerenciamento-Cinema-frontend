# 🎬 CineManager - Frontend

> Interface web moderna para gerenciamento de cinemas, desenvolvida com React.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.12.2-5A29E4?logo=axios&logoColor=white)

---

## 📋 Sobre o Projeto

O **CineManager Frontend** é a interface web do sistema de gestão de cinemas. Esta aplicação permite que administradores e funcionários gerenciem de forma eficiente:

- 🎥 **Salas de cinema** - Cadastro e gerenciamento de salas com capacidade
- 🎬 **Sessões** - Programação de filmes com horários e preços
- 🍿 **Produtos** - Controle de bomboniere (pipoca, refrigerantes, etc.)
- 👥 **Usuários** - Gerenciamento de acesso ao sistema

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React** | 19.2.0 | Biblioteca principal para construção da interface |
| **React Router DOM** | 7.9.4 | Gerenciamento de rotas e navegação SPA |
| **Axios** | 1.12.2 | Requisições HTTP para comunicação com a API |
| **React Toastify** | 10.0.5 | Notificações visuais (toasts) para feedback ao usuário |
| **Create React App** | 5.0.1 | Configuração e build do projeto |

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Navbar.js       # Barra de navegação principal
│   └── PrivateRoute.js # Componente de proteção de rotas
│
├── contexts/            # Contextos React (gerenciamento de estado global)
│   ├── AuthContext.js  # Contexto de autenticação (login/logout)
│   └── ThemeContext.js # Contexto de tema (claro/escuro)
│
├── pages/               # Páginas da aplicação
│   ├── Login.js        # Tela de login
│   ├── Register.js     # Tela de cadastro de novos usuários
│   ├── Dashboard.js    # Painel principal com resumo do sistema
│   ├── Salas.js        # Gerenciamento de salas de cinema
│   ├── Sessoes.js      # Gerenciamento de sessões de filmes
│   ├── Produtos.js     # Gerenciamento de produtos da bomboniere
│   └── Usuarios.js     # Gerenciamento de usuários do sistema
│
├── services/            # Serviços de comunicação externa
│   └── api.js          # Configuração do Axios e interceptors
│
├── App.js              # Componente raiz com configuração de rotas
├── App.css             # Estilos globais da aplicação
└── index.js            # Ponto de entrada da aplicação
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente incluído com o Node.js)
- **Backend CineManager** rodando (API REST)

---

## 🔧 Instalação e Configuração

### 1. Clone ou acesse o projeto

```bash
cd api-player-front-final
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure a conexão com o Backend

O arquivo `src/services/api.js` contém a configuração de conexão com a API. Verifique se a URL base está correta:

```javascript
// src/services/api.js
const api = axios.create({
    baseURL: 'http://localhost:3001' // URL do seu backend
});
```

> ⚠️ **Importante:** O backend deve estar rodando antes de iniciar o frontend.

---

## ▶️ Como Executar

### Modo de Desenvolvimento

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
npm start
```

A aplicação será aberta automaticamente em:
- 🌐 **http://localhost:3000**

O servidor possui **hot reload** - qualquer alteração no código será refletida automaticamente no navegador.

### Build para Produção

Para gerar a versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build/`.

---

## 🔐 Sistema de Autenticação

A aplicação utiliza um sistema de autenticação baseado em **JWT (JSON Web Token)**:

1. **Login:** O usuário fornece credenciais (email/senha)
2. **Token:** A API retorna um token JWT válido
3. **Armazenamento:** O token é salvo no `localStorage`
4. **Proteção:** Rotas privadas verificam a existência do token
5. **Requisições:** O token é enviado automaticamente em todas as requisições

### Rotas Públicas
- `/login` - Página de login
- `/register` - Página de cadastro

### Rotas Protegidas (requerem autenticação)
- `/dashboard` - Painel principal
- `/salas` - Gerenciamento de salas
- `/sessoes` - Gerenciamento de sessões
- `/produtos` - Gerenciamento de produtos

---

## 🎨 Funcionalidades Principais

### 📊 Dashboard
- Visão geral do sistema
- Estatísticas de salas, sessões e produtos
- Acesso rápido às principais funcionalidades

### 🎥 Gerenciamento de Salas
- Listar todas as salas
- Criar novas salas
- Editar informações (nome, capacidade)
- Excluir salas

### 🎬 Gerenciamento de Sessões
- Programar sessões de filmes
- Definir horários e preços
- Associar sessões às salas
- Controle de disponibilidade

### 🍿 Gerenciamento de Produtos
- Cadastrar produtos da bomboniere
- Definir preços e categorias
- Controle de estoque
- Edição e exclusão de itens

### 👥 Gerenciamento de Usuários
- Listar usuários do sistema
- Editar perfis de usuário
- Gerenciar permissões de acesso

---

## 🧪 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm test` | Executa os testes automatizados |
| `npm run build` | Gera build de produção |
| `npm run eject` | Ejeta as configurações do CRA* |

> *⚠️ `npm run eject` é uma operação irreversível. Use apenas se precisar de configurações avançadas.

---

## 🌐 Contextos Globais

### AuthContext
Gerencia o estado de autenticação global:
- `user` - Dados do usuário logado
- `token` - Token JWT armazenado
- `login()` - Função para realizar login
- `logout()` - Função para realizar logout
- `isAuthenticated` - Verifica se está autenticado

### ThemeContext
Gerencia o tema visual da aplicação:
- `theme` - Tema atual (light/dark)
- `toggleTheme()` - Alterna entre temas

---

## 🔗 Integração com o Backend

Esta aplicação frontend comunica-se com a API REST do CineManager através dos seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Autenticação de usuário |
| POST | `/auth/register` | Cadastro de novo usuário |
| GET | `/salas` | Lista todas as salas |
| POST | `/salas` | Cria nova sala |
| PUT | `/salas/:id` | Atualiza uma sala |
| DELETE | `/salas/:id` | Remove uma sala |
| GET | `/sessoes` | Lista todas as sessões |
| POST | `/sessoes` | Cria nova sessão |
| PUT | `/sessoes/:id` | Atualiza uma sessão |
| DELETE | `/sessoes/:id` | Remove uma sessão |
| GET | `/produtos` | Lista todos os produtos |
| POST | `/produtos` | Cria novo produto |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |

---

## ❓ Solução de Problemas

### Erro: "Cannot connect to backend"
1. Verifique se o backend está rodando
2. Confirme a URL em `src/services/api.js`
3. Verifique se as portas estão corretas

### Erro: "npm start" não funciona no PowerShell
Execute este comando antes:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Página em branco após login
1. Verifique o console do navegador (F12)
2. Confirme se o token está sendo salvo corretamente
3. Limpe o `localStorage` e tente novamente

---

## 📚 Saiba Mais

- [Documentação do React](https://react.dev/)
- [Documentação do React Router](https://reactrouter.com/)
- [Documentação do Axios](https://axios-http.com/)
- [Create React App](https://create-react-app.dev/)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

<div align="center">

**Desenvolvido com ❤️ usando React**

</div>
