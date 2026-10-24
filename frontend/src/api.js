const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export async function apiRequest(path, { token, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Não consegui conectar à API em ${API_BASE}. Inicie o backend e confira a configuração VITE_API_BASE_URL.`);
    }
    throw error;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) throw new Error(data.message || `Falha na API (${response.status}).`);
  return data;
}

export const api = {
  categories: () => apiRequest('/categoria/todos'),
  demands: () => apiRequest('/solicitacao/listar-solicitacoes'),
  registerCitizen: (body) => apiRequest('/cidadao/register', { method: 'POST', body: JSON.stringify(body) }),
  loginCitizen: (body) => apiRequest('/cidadao/login', { method: 'POST', body: JSON.stringify(body) }),
  loginServer: (body) => apiRequest('/servidor/login', { method: 'POST', body: JSON.stringify(body) }),
  serverMe: (token) => apiRequest('/servidor/me', { token }),
  createDemand: (body, token) => apiRequest('/cidadao/criar-solicitacao', { method: 'POST', token, body: JSON.stringify(body) }),
  updateDemand: (body, token) => apiRequest('/solicitacao/update', { method: 'POST', token, body: JSON.stringify(body) }),
  demandDetails: (id) => apiRequest(`/solicitacao/${encodeURIComponent(id)}`),
};

const statusFromApi = (value) => ({ Aberta: 'Pendente', 'Em andamento': 'Em andamento', Concluido: 'Concluída', Concluído: 'Concluída' }[value] || value || 'Pendente');
const urgencyFromApi = (value) => ({ Baixo: 'Baixa', Medio: 'Média', Médio: 'Média', Alto: 'Alta' }[value] || value || 'Baixa');

export function mapDemand(row, categories = []) {
  return {
    id: row.protocolo || `ARC-${row.pk_id_solicitacao}`,
    apiId: row.pk_id_solicitacao,
    title: row.titulo || row.title || 'Solicitação sem título',
    category: row.categoria || row.nome_categoria || 'Geral',
    neighborhood: row.bairro || '—',
    address: row.rua || '',
    description: row.descricao || '',
    urgency: urgencyFromApi(row.nivel_urgencia),
    reach: 'Não informado pela API',
    status: statusFromApi(row.situacao),
    sector: row.nome_orgao || row.orgao || categories.find((item) => item.pk_id_categoria === row.fk_id_categoria)?.orgaos?.find((org) => org.id === row.fk_id_orgao)?.nome || 'A definir',
    orgId: row.fk_id_orgao || null,
    responsible: 'Equipe municipal',
    dueDate: '',
    createdAt: row.data_criacao || new Date().toISOString(),
    history: [],
    photo: '',
    categoryId: row.fk_id_categoria,
  };
}

export function statusToApi(status) {
  return ({ Pendente: 'Aberta', 'Aguardando equipe': 'Aberta', 'Em andamento': 'Em andamento', 'Concluída': 'Concluido' })[status] || status;
}

export function urgencyToApi(urgency) {
  return ({ Baixa: 'Baixo', Média: 'Medio', Alta: 'Alto' })[urgency] || urgency;
}

