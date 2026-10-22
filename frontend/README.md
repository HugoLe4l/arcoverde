# Arcoverde Conecta

Protótipo front-end em React para apoiar equipes municipais no registro, encaminhamento, priorização e acompanhamento das demandas de serviços públicos de Arcoverde, Pernambuco.

## Problema

Como integrar e priorizar as demandas de serviços públicos de Arcoverde para melhorar o atendimento à população? O desafio foi selecionado no portal Desafios PE. Os requisitos funcionais vêm da documentação entregue com a atividade.

## Solução proposta

Um painel de demonstração voltado às equipes e gestores municipais reúne solicitações em uma fila pesquisável, destaca urgências e prazos vencidos e mostra a concentração ilustrativa de demandas por bairro. Cada registro tem um identificador, localização, categoria, urgência, alcance, foto opcional e histórico. A equipe pode encaminhar uma demanda a um setor, indicar responsável e prazo, atualizar o status e compartilhar providências no histórico.

## Requisitos funcionais contemplados no protótipo

- Cadastro com descrição, categoria, bairro, endereço ou referência, fotografia, urgência e alcance.
- Identificador `ARC-AAAA-NNNN` e histórico cronológico de atendimento.
- Distribuição por setor, responsável e prazo previsto.
- Atualização de situação e publicação de providências no histórico.
- Dashboard territorial esquemático com contagem por bairro, altas urgências e prazos vencidos.
- Consulta com busca por assunto, bairro ou ID e filtros por situação, categoria e urgência.
- Interface responsiva, React, componentes reutilizáveis, Hooks, props e eventos.

## Como executar

1. Instale Node.js LTS e npm.
2. No terminal, entre na pasta `frontend` e execute `npm install`.
3. Execute `npm run dev` e abra o endereço local informado pelo Vite.
4. Para gerar a versão de produção, execute `npm run build`.

## Organização do front-end

```text
src/
  App.jsx       Estado compartilhado, persistência local e navegação
  index.css     Tema Coastal adaptado, componentes visuais e responsividade
components/
  Header.jsx
  DemandForm.jsx
  DemandsList.jsx
  DemandDetails.jsx
  Footer.jsx
pages/
  Home.jsx      Dashboard e resumo territorial
public/
  coastal-blue.jpg
```

## Integração com o backend

Este projeto contém somente o front-end. O protótipo usa registros fictícios e `localStorage` para que os fluxos possam ser apresentados antes da API do backend. Ao integrar com o projeto do colega, substitua a leitura/gravação local em `src/App.jsx` por chamadas à API acordada entre a equipe. Mantenha endereços específicos da máquina fora do código-fonte.

## Demonstração, segurança e privacidade

Use somente dados fictícios nesta entrega. A imagem selecionada é reduzida no navegador e fica no armazenamento local deste navegador. O protótipo não envia informações a um servidor, não implementa autenticação/permissões e não usa mapa geográfico real nem IA. Uma implantação municipal exige autenticação por perfil, proteção de dados pessoais, armazenamento seguro, validação no backend e dados verificados. As decisões de prioridade continuam sob responsabilidade dos agentes públicos.

## Referências

- Tema: [Desafios PE — integração e priorização das demandas de Arcoverde](https://desafios.pe.gov.br/challenge?url=como-podemos-integrar-e-priorizar-as-demandas-de-servicos-publicos-de-arcoverde-para-melhorar-o-atendimento-a-populacao-1)
- A direção visual azul, turquesa e de imagem panorâmica foi inspirada no ZIP Coastal fornecido para a atividade.
