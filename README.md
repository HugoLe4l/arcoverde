# Arcoverde Conecta

Aplicação acadêmica para registrar e acompanhar solicitações de serviços públicos de Arcoverde, Pernambuco. O projeto contém uma interface React e uma API Flask integrada a PostgreSQL.

## Problema escolhido

Solicitações públicas recebidas por canais diferentes são difíceis de acompanhar e priorizar sem uma visão compartilhada entre população e equipes municipais.

## Solução proposta

O Arcoverde Conecta reúne o registro de solicitações e a fila de atendimento. Cidadãos podem criar uma conta e enviar demandas; servidores autenticados podem consultar a fila, alterar situação e urgência, encaminhar para órgãos associados e registrar atualizações no histórico.

## Requisitos

- Node.js e npm
- Python 3.10 ou superior
- PostgreSQL em execução

## Executar o backend

No terminal, na pasta `backend`, crie e ative um ambiente virtual, instale as dependências e inicie a API:

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

O backend inicializa o banco PostgreSQL e as tabelas. Configure a conexão com o PostgreSQL em `backend/config/database.py` conforme o ambiente local. Na primeira execução, o terminal poderá solicitar os dados para criar a conta Admin inicial.

A API fica disponível em `http://localhost:5000`.

## Executar o frontend

Em outro terminal, na pasta `frontend`:

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

O arquivo `.env` usa `VITE_API_BASE_URL=http://localhost:5000`. Ajuste o endereço se a API estiver em outro host. Abra no navegador o endereço que o Vite mostrar, normalmente `http://localhost:5173`.

## Funcionalidades ligadas à API

- Consulta de categorias e solicitações.
- Cadastro e login de cidadãos com CPF e senha.
- Login de servidor com matrícula e senha.
- Cadastro de solicitação pelo cidadão autenticado.
- Portal de gestão com atualização de situação, urgência, órgão responsável e histórico.

O backend atual não aceita anexos de imagem, prazos ou atribuição de servidor individual. A tela foi alinhada aos campos disponíveis na API. O painel apresenta a fila retornada pelo backend; a API documentada ainda não fornece uma rota para filtrar as solicitações pelo cidadão autenticado.

## Estrutura

```text
backend/   API Flask, modelos, rotas e inicialização do PostgreSQL
frontend/  interface React e cliente da API
README.md  instruções do projeto
```
