# Documentação da API

Base URL local: `http://localhost:5000`

As rotas recebem e retornam JSON, salvo quando indicado. As rotas protegidas
esperam o token no cabeçalho:

```http
Authorization: Bearer <token>
```

Os tokens de cidadão e servidor expiram em duas horas. Envie o token retornado
no login correspondente.

## Cidadãos

### Registrar cidadão

- **Método e rota:** `POST /cidadao/register`
- **Autenticação:** não exige token.
- **Corpo obrigatório:**

```json
{
  "nome": "Maria da Silva",
  "cpf": "12345678900",
  "email": "maria@example.com",
  "senha": "uma-senha"
}
```

- **Sucesso:** `201 Created`.
- **Erros comuns:** `400` para dados ausentes; `409` se CPF ou e-mail já
  estiverem cadastrados.

### Login de cidadão

- **Método e rota:** `POST /cidadao/login`
- **Autenticação:** não exige token.
- **Corpo obrigatório:**

```json
{
  "cpf": "12345678900",
  "senha": "uma-senha"
}
```

- **Sucesso:** `200 OK`, com token:

```json
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "token": "<token>"
}
```

- **Erro de credenciais:** `401 Unauthorized`.

### Criar solicitação

- **Método e rota:** `POST /cidadao/criar-solicitacao`
- **Autenticação:** token de cidadão.
- **Corpo obrigatório:**

```json
{
  "titulo": "Buraco na rua",
  "categoria_id": 1,
  "bairro": "Centro",
  "rua": "Rua das Flores",
  "descricao": "Buraco próximo à praça"
}
```

- **Coordenadas opcionais:** envie `latitude` e `longitude` juntas. Latitude
  deve estar entre `-90` e `90`; longitude, entre `-180` e `180`.

```json
{
  "titulo": "Buraco na rua",
  "categoria_id": 1,
  "bairro": "Centro",
  "rua": "Rua das Flores",
  "descricao": "Buraco próximo à praça",
  "latitude": -8.4192,
  "longitude": -37.0561
}
```

- **Importante:** use o ID retornado por `GET /categoria/todos`. O cidadão
  não informa o órgão responsável; esse campo é definido por um servidor.
- **Sucesso:** `201 Created`.
- **Erros comuns:** `400` para campos ausentes, categoria inexistente, tipo
  de categoria incorreto ou coordenadas inválidas; `401` sem token válido;
  `403` se o token não for de cidadão.

## Servidores

### Login de servidor

- **Método e rota:** `POST /servidor/login`
- **Autenticação:** não exige token.
- **Corpo obrigatório:**

```json
{
  "matricula": 1801590,
  "senha": "uma-senha"
}
```

- **Sucesso:** `200 OK`, com token que identifica o servidor e seu cargo.
- **Erro de credenciais:** `401 Unauthorized`.

### Cadastrar servidor como Atendente

- **Método e rota:** `POST /servidor/cadastrar`
- **Autenticação:** token de servidor com cargo `Admin` ou `Gestor`.
- **Corpo obrigatório:**

```json
{
  "matricula": 1801591,
  "nome": "João da Silva",
  "senha_recebida": "uma-senha"
}
```

- **Importante:** esta rota sempre cria o servidor como `Atendente`; o cargo
  não deve ser enviado no corpo.
- **Sucesso:** `201 Created`.
- **Erros comuns:** `400` para dados ausentes; `401` sem token válido;
  `403` para cidadão, Atendente ou outro cargo sem permissão; `409` se a
  matrícula já existir.

### Consultar os dados do servidor autenticado

- **Método e rota:** `GET /servidor/me`
- **Autenticação:** token de servidor, qualquer cargo.
- **Corpo:** nenhum.
- **Sucesso:** `200 OK`, com matrícula, nome e cargo. A senha/hash não é
  retornada.

### Consultar servidor por matrícula

- **Método e rota:** `GET /servidor/matricula/<matricula>`
- **Autenticação:** token de servidor, qualquer cargo.
- **Parâmetro de caminho:** matrícula numérica. Exemplo:
  `GET /servidor/matricula/1801590`.
- **Corpo:** nenhum.
- **Sucesso:** `200 OK`, com matrícula, nome e cargo.
- **Servidor inexistente:** `404 Not Found`.

### Listar todos os servidores

- **Método e rota:** `GET /servidor/todos`
- **Autenticação:** token de servidor, qualquer cargo.
- **Corpo:** nenhum.
- **Sucesso:** `200 OK`, com a lista de matrícula, nome e cargo. Senhas/hashes
  não são retornados.

### Promover Atendente a Gestor

- **Método e rota:** `POST /servidor/promover-gestor`
- **Autenticação:** token de servidor com cargo `Admin`.
- **Corpo obrigatório:**

```json
{
  "matricula": 1801591
}
```

- **Sucesso:** `200 OK`.
- **Erros comuns:** `400` se matrícula estiver ausente ou não for número;
  `401` sem token válido; `403` se o token não for de Admin; `404` se o
  servidor não existir; `409` se o servidor existente não for Atendente.
- **Importante:** após a promoção, o servidor promovido deve fazer login
  novamente para receber um token com o cargo atualizado.

## Categorias e órgãos

### Listar categorias

- **Método e rota:** `GET /categoria/todos`
- **Autenticação:** não exige token.
- **Corpo:** nenhum.
- **Sucesso:** `200 OK`, com cada categoria e os órgãos associados:

```json
{
  "success": true,
  "data": [
    {
      "pk_id_categoria": 1,
      "nome": "Infraestrutura urbana",
      "orgaos": [
        {
          "id": 1,
          "nome": "Secretaria de Infraestrutura"
        }
      ]
    }
  ]
}
```

### Listar órgãos

- **Método e rota:** `GET /orgao/todos`
- **Autenticação:** não exige token.
- **Corpo:** nenhum.
- **Sucesso:** `200 OK`, com cada órgão e as categorias associadas:

```json
{
  "success": true,
  "data": [
    {
      "pk_id_orgao": 1,
      "nome": "Secretaria de Infraestrutura",
      "categorias": [
        {
          "id": 1,
          "nome": "Infraestrutura urbana"
        }
      ]
    }
  ]
}
```

## Solicitações

### Listar solicitações

- **Método e rota:** `GET /solicitacao/listar-solicitacoes`
- **Autenticação:** atualmente não exige token.
- **Corpo:** nenhum.
- **Resposta:** objeto JSON com `success`, `message` e `resultado`, que contém
  uma lista de solicitações. Os campos vêm da tabela de solicitações, incluindo
  categoria, urgência, órgão e, quando informadas, latitude e longitude.
- **Status de sucesso atual:** `201` (o endpoint usa esse status mesmo sendo
  uma consulta).

### Consultar solicitação por ID

- **Método e rota:** `GET /solicitacao/<id_solicitacao>`
- **Autenticação:** atualmente não exige token.
- **Parâmetro de caminho:** ID numérico. Exemplo:
  `GET /solicitacao/12`.
- **Corpo:** nenhum.
- **Resposta:** objeto JSON com `success`, `message` e `resultado`; o resultado
  inclui `solicitacao` e `historico`.
- **Status de sucesso atual:** `201`.

### Consultar solicitação por protocolo

- **Método e rota:** `GET /solicitacao/<protocolo>`
- **Autenticação:** atualmente não exige token.
- **Parâmetro de caminho:** protocolo. Exemplo:
  `GET /solicitacao/ARC-20261024-ABC1234`.
- **Corpo:** nenhum.
- **Resposta:** objeto JSON com `success`, `message` e `resultado`, com os
  dados da solicitação.
- **Status de sucesso atual:** `201`.

### Atualizar situação, urgência e órgão responsável

- **Método e rota:** `POST /solicitacao/update`
- **Autenticação:** token de servidor, qualquer cargo.
- **Campos obrigatórios:**

```json
{
  "id_solicitacao": 12,
  "nova_situacao": "Em andamento"
}
```

- **Valores aceitos para `nova_situacao`:** `Aberta`, `Em andamento` e
  `Concluido` (sem acento, conforme o enum atual do banco).
- **Campos opcionais:**
  - `nivel_urgencia`: `Baixo`, `Medio` ou `Alto`.
  - `orgao_id`: ID do órgão associado à categoria da solicitação.
  - `observacao`: texto para registrar no histórico.
- **Exemplo completo:**

```json
{
  "id_solicitacao": 12,
  "nova_situacao": "Em andamento",
  "nivel_urgencia": "Alto",
  "orgao_id": 1,
  "observacao": "Encaminhada para a equipe responsável"
}
```

- **Importante:** matrícula do servidor não deve ser enviada; ela é extraída
  do token. Se `orgao_id` for enviado, o backend valida que o órgão está
  associado à categoria da solicitação. Sem `orgao_id`, o órgão atual é
  mantido. A atualização e o registro correspondente no histórico são feitos
  na mesma transação.
- **Sucesso:** `200 OK`.
- **Erros comuns:** `400` para campos obrigatórios ou valores inválidos;
  `401` sem token válido; `403` para token que não seja de servidor ou falha
  no processamento; a solicitação inexistente ou órgão não associado também
  retorna falha.

## Observações para integração

- IDs de categoria e órgão devem vir de `GET /categoria/todos` e
  `GET /orgao/todos`; não use os nomes como identificadores.
- As consultas de solicitações não exigem autenticação no código atual.
- A API permite CORS de qualquer origem durante a configuração atual.
- O banco é inicializado pelo backend. Se não existir nenhum Admin, a
  inicialização pede matrícula, nome e senha no terminal; a senha é
  armazenada como hash bcrypt.
