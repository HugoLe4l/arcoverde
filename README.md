# Arcoverde Conecta

Aplicação acadêmica para registrar e acompanhar solicitações de serviços
públicos de Arcoverde, Pernambuco. O projeto reúne uma interface React, uma API
Flask e um banco de dados PostgreSQL.

## Sobre o projeto

Solicitações públicas recebidas por diferentes canais podem ser difíceis de
acompanhar e priorizar. O Arcoverde Conecta reúne o registro das demandas e a
fila de atendimento em uma plataforma compartilhada entre cidadãos e equipes
municipais.

### Funcionalidades

- Consulta de solicitações e categorias disponíveis na API.
- Cadastro e autenticação de cidadãos com CPF e senha.
- Autenticação de servidores com matrícula e senha.
- Registro de solicitações por cidadãos autenticados.
- Mapa com solicitações abertas que possuem coordenadas.
- Portal do servidor para consultar e atualizar situação e urgência, encaminhar
  solicitações a órgãos responsáveis e registrar providências no histórico.
- Central do gestor para cadastrar atendentes e consultar servidores; usuários
  Admin também podem promover atendentes a Gestor.

### Limitações conhecidas

- A API atual não aceita anexos de imagem, prazos ou atribuição de um servidor
  individual.
- A API não oferece uma rota para filtrar solicitações pelo cidadão autenticado;
  por isso, a lista exibida depende dos dados retornados pela API.

## Requisitos

- Python 3.10 ou superior.
- Node.js e npm.
- PostgreSQL em execução.

## Configuração e execução

Inicie primeiro o PostgreSQL e configure os dados de conexão usados pelo
backend em `backend/config/database.py`. Não compartilhe nem envie credenciais
reais ao repositório.

### Backend

No PowerShell, a partir da pasta raiz do projeto:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Na primeira inicialização, a API cria o banco e as tabelas. Se ainda não
houver um administrador cadastrado, o terminal solicitará matrícula, nome e
senha para criar a conta Admin inicial.

A API fica disponível em `http://localhost:5000`.

### Frontend

Abra outro terminal na pasta raiz do projeto:

```powershell
cd frontend
npm install
npm run dev
```

O frontend usa `http://localhost:5000` como endereço da API. Se ela estiver em
outro endereço, altere a constante `API_BASE_URL` em
`frontend/src/services/api.js`. Abra no navegador a URL informada pelo Vite,
normalmente `http://localhost:5173`.

## Comandos do frontend

Execute-os dentro da pasta `frontend`:

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão de produção em `frontend/dist`. |
| `npm run preview` | Pré-visualiza a versão de produção. |
| `npm run lint` | Executa o ESLint. |
| `npm run format` | Formata os arquivos do frontend. |
| `npm run format:check` | Verifica a formatação sem alterar arquivos. |

## Documentação da API

Consulte [`backend/ROTAS_API.md`](backend/ROTAS_API.md) para ver as rotas,
parâmetros e exemplos de requisições.

## Estrutura do projeto

```text
backend/   API Flask, modelos, rotas e inicialização do PostgreSQL
frontend/  Interface React e cliente da API
README.md  Documentação e instruções para executar o projeto
```
