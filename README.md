# Arcoverde Conecta

Protótipo de uma aplicação web para organizar e acompanhar solicitações de serviços públicos em Arcoverde, Pernambuco. O projeto foi desenvolvido em React como proposta acadêmica.

## Problema escolhido

Como integrar e priorizar as demandas de serviços públicos de Arcoverde para melhorar o atendimento à população? Quando solicitações chegam por canais diferentes e não há uma visão compartilhada, fica mais difícil acompanhar o andamento, identificar prazos e organizar o trabalho das equipes.

## Solução proposta

O Arcoverde Conecta reúne as solicitações em um painel único para apoiar o registro, o encaminhamento e o acompanhamento dos serviços. A interface apresenta indicadores, permite pesquisar e filtrar solicitações e mostra informações de localização, categoria, urgência, situação, responsável e prazo. Também inclui uma apresentação do projeto e uma explicação visual de como o atendimento pode funcionar.

O protótipo também apresenta opções de acesso para cidadãos (entrar e criar cadastro), uma tela de entrada para servidores e um portal demonstrativo de gestão. No portal do servidor, é possível consultar e filtrar a fila; ao abrir uma solicitação, a equipe pode alterar o setor, responsável, prazo, situação e histórico.

O protótipo usa dados de demonstração e armazenamento local do navegador (`localStorage`). Ele não está conectado a uma API ou banco de dados compartilhado. As telas de login são demonstrativas: não validam contas e não armazenam senhas. As alterações nas solicitações ficam no navegador em que foram feitas.

## Tecnologias

- React
- Vite
- JavaScript e CSS
- npm

## Requisitos

- Node.js na versão LTS (inclui npm)
- Um navegador atualizado

## Como executar

Abra um terminal na pasta `frontend` e instale as dependências:

```bash
cd frontend
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço local informado pelo Vite, normalmente `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
```

O resultado será criado na pasta `frontend/dist`. Para visualizar essa versão localmente, execute `npm run preview` dentro de `frontend`.

## Estrutura do projeto

```text
frontend/
├── components/   # Componentes reutilizados da interface
├── data/         # Dados de demonstração
├── pages/        # Telas, incluindo painel, solicitações e perfil
├── public/       # Imagens e outros arquivos públicos
├── src/          # Inicialização da aplicação, estado e estilos
├── index.html
└── package.json  # Dependências e comandos do projeto
```

## Observação sobre os dados

Use somente dados fictícios nesta demonstração. Antes de usar o sistema com solicitações reais, é necessário integrar um backend, implementar autenticação e controle de acesso e definir medidas adequadas de segurança e proteção de dados.
