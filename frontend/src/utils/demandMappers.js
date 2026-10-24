const situacao_da_api = (value) =>
  ({
    Aberta: 'Pendente',
    'Em andamento': 'Em andamento',
    Concluido: 'Concluída',
    Concluído: 'Concluída',
  })[value] ||
  value ||
  'Pendente';

const urgencia_da_api = (value) =>
  ({
    Baixo: 'Baixa',
    Medio: 'Média',
    Médio: 'Média',
    Alto: 'Alta',
  })[value] ||
  value ||
  'Baixa';

export function mapear_solicitacao(row, categories = []) {
  const category = categories.find((item) => item.pk_id_categoria === row.fk_id_categoria);
  const org = category?.orgaos?.find((item) => item.id === row.fk_id_orgao);
  const latitude = row.latitude == null ? null : Number(row.latitude);
  const longitude = row.longitude == null ? null : Number(row.longitude);

  return {
    id: row.protocolo || `ARC-${row.pk_id_solicitacao}`,
    apiId: row.pk_id_solicitacao,
    title: row.titulo || 'Solicitação sem título',
    category: row.categoria || row.nome_categoria || category?.nome || 'Geral',
    neighborhood: row.bairro || '—',
    cep: row.cep || '',
    address: row.rua || '',
    description: row.descricao || '',
    urgency: urgencia_da_api(row.nivel_urgencia),
    status: situacao_da_api(row.situacao),
    sector: row.nome_orgao || row.orgao || org?.nome || 'A definir',
    orgId: row.fk_id_orgao || null,
    createdAt: row.data_criacao || new Date().toISOString(),
    history: [],
    categoryId: row.fk_id_categoria,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null,
  };
}

export function situacao_para_api(status) {
  return (
    {
      Pendente: 'Aberta',
      'Aguardando equipe': 'Aberta',
      'Em andamento': 'Em andamento',
      Concluída: 'Concluido',
    }[status] || status
  );
}

export function urgencia_para_api(urgency) {
  return { Baixa: 'Baixo', Média: 'Medio', Alta: 'Alto' }[urgency] || urgency;
}
