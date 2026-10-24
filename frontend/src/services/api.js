const API_BASE_URL = 'http://localhost:5000';

async function fazer_requisicao(path, { token, method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (cause) {
    if (cause instanceof TypeError) {
      throw new Error(
        `Não consegui conectar à API em ${API_BASE_URL}. Inicie o backend e confira o endereço em frontend/src/services/api.js.`,
        { cause },
      );
    }
    throw cause;
  }

  let data;
  try {
    data = await response.json();
  } catch (cause) {
    const error = new Error(`A API retornou uma resposta inválida (HTTP ${response.status}).`, {
      cause,
    });
    error.status = response.status;
    throw error;
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    const error = new Error(`A API retornou um formato inválido (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }

  if (!response.ok || data.success === false) {
    const error = new Error(data.message || `Falha na API (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function registrar_cidadao(cidadao) {
  return fazer_requisicao('/cidadao/register', { method: 'POST', body: cidadao });
}

export async function entrar_cidadao(credenciais) {
  return fazer_requisicao('/cidadao/login', { method: 'POST', body: credenciais });
}

export async function obter_sessao_cidadao(token) {
  return fazer_requisicao('/cidadao/me', { token });
}

export async function criar_solicitacao(solicitacao, token) {
  return fazer_requisicao('/cidadao/criar-solicitacao', {
    method: 'POST',
    token,
    body: solicitacao,
  });
}

export async function entrar_servidor(credenciais) {
  return fazer_requisicao('/servidor/login', { method: 'POST', body: credenciais });
}

export async function cadastrar_servidor(servidor, token) {
  return fazer_requisicao('/servidor/cadastrar', {
    method: 'POST',
    token,
    body: servidor,
  });
}

export async function obter_sessao_servidor(token) {
  return fazer_requisicao('/servidor/me', { token });
}

export async function obter_servidor_por_matricula(matricula, token) {
  return fazer_requisicao(`/servidor/matricula/${encodeURIComponent(matricula)}`, { token });
}

export async function listar_servidores(token) {
  return fazer_requisicao('/servidor/todos', { token });
}

export async function promover_servidor(servidor, token) {
  return fazer_requisicao('/servidor/promover-gestor', {
    method: 'POST',
    token,
    body: servidor,
  });
}

export async function listar_categorias() {
  return fazer_requisicao('/categoria/todos');
}

export async function listar_orgaos() {
  return fazer_requisicao('/orgao/todos');
}

export async function listar_solicitacoes() {
  return fazer_requisicao('/solicitacao/listar-solicitacoes');
}

export async function obter_solicitacao_por_id(id) {
  return fazer_requisicao(`/solicitacao/${encodeURIComponent(id)}`);
}

export async function obter_solicitacao_por_protocolo(protocolo) {
  return fazer_requisicao(`/solicitacao/${encodeURIComponent(protocolo)}`);
}

export async function atualizar_solicitacao(atualizacao, token) {
  return fazer_requisicao('/solicitacao/update', {
    method: 'POST',
    token,
    body: atualizacao,
  });
}
