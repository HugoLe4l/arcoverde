import { useCallback, useEffect, useState } from 'react';
import { obter_solicitacao_por_id } from '../services/api.js';
const formatar_data_hora = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Data indisponível'
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

function aplicar_detalhes(response, setHistory, setOrgId) {
  const result = response.resultado || {};
  setHistory(
    (result.historico || []).map((entry) => ({
      date: entry.data_atualizacao,
      text: entry.observacao || `Situação atualizada para ${entry.situacao_nova}.`,
      by: `Matrícula ${entry.fk_matricula_servidor}`,
    })),
  );
  const row = result.solicitacao;
  if (row) setOrgId(row.fk_id_orgao ? String(row.fk_id_orgao) : '');
}

export function DetalhesSolicitacao({
  demand,
  ao_fechar,
  ao_atualizar_solicitacao,
  isServer,
  categories = [],
}) {
  const [note, setNote] = useState('');
  const [history, setHistory] = useState(demand.history || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [orgId, setOrgId] = useState(demand.orgId ? String(demand.orgId) : '');
  const category = categories.find(
    (item) => item.pk_id_categoria === demand.categoryId || item.nome === demand.category,
  );
  const orgs = category?.orgaos || [];
  const recarregar_detalhes = useCallback(async () => {
    try {
      const response = await obter_solicitacao_por_id(demand.apiId);
      aplicar_detalhes(response, setHistory, setOrgId);
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [demand.apiId]);

  useEffect(() => {
    let active = true;
    obter_solicitacao_por_id(demand.apiId)
      .then((response) => {
        if (!active) return;
        aplicar_detalhes(response, setHistory, setOrgId);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [demand.apiId]);

  async function registrar_observacao(event) {
    event.preventDefault();
    if (!note.trim() || !isServer || saving) return;
    setSaving(true);
    setError('');
    try {
      const success = await ao_atualizar_solicitacao(demand.id, {}, note.trim());
      if (success) {
        setNote('');
        await recarregar_detalhes();
      }
    } finally {
      setSaving(false);
    }
  }
  async function alterar_campo(field, value) {
    if (!isServer || saving) return;
    setSaving(true);
    setError('');
    try {
      const success = await ao_atualizar_solicitacao(
        demand.id,
        { [field]: value },
        `Atualização registrada: ${field === 'status' ? `situação ${value}` : `urgência ${value}`}.`,
      );
      if (success) await recarregar_detalhes();
    } finally {
      setSaving(false);
    }
  }
  async function atribuir_orgao(value) {
    if (!value || !isServer || saving) return;
    const name = orgs.find((item) => String(item.id) === value)?.nome;
    setSaving(true);
    setError('');
    try {
      const success = await ao_atualizar_solicitacao(
        demand.id,
        { orgId: Number(value) },
        `Solicitação encaminhada para ${name || 'o órgão responsável'}.`,
      );
      if (success) await recarregar_detalhes();
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="page-container demand-details-page">
      <button className="button-quiet detail-back" onClick={ao_fechar}>
        ← Voltar
      </button>
      <article className="panel demand-details-card" aria-labelledby="detail-title">
        <div className="detail-top">
          <span className="eyebrow">FICHA DE ATENDIMENTO</span>
        </div>
        <span className="demand-id">{demand.id}</span>
        <h1 id="detail-title">{demand.title}</h1>
        <div className="detail-pills">
          <span className={`urgency-pill urgency-${demand.urgency.toLowerCase()}`}>
            Urgência {demand.urgency.toLowerCase()}
          </span>
          <span
            className={`status-pill status-${demand.status.toLowerCase().replaceAll(' ', '-')}`}
          >
            {demand.status}
          </span>
        </div>
        <p className="detail-description">{demand.description}</p>
        <div className="detail-facts">
          <div>
            <small>LOCALIZAÇÃO</small>
            <b>{demand.neighborhood}</b>
            <span>{demand.address}</span>
          </div>
          <div>
            <small>CEP</small>
            <b>{demand.cep || 'Não informado'}</b>
          </div>
          <div>
            <small>CATEGORIA</small>
            <b>{demand.category}</b>
          </div>
          <div>
            <small>ÓRGÃO RESPONSÁVEL</small>
            <b>{demand.sector}</b>
          </div>
          <div>
            <small>REGISTRADA</small>
            <b>{formatar_data_hora(demand.createdAt)}</b>
          </div>
          {Number.isFinite(demand.latitude) && Number.isFinite(demand.longitude) && (
            <div>
              <small>COORDENADAS</small>
              <b>
                {demand.latitude}, {demand.longitude}
              </b>
              <a
                href={`https://www.openstreetmap.org/?mlat=${demand.latitude}&mlon=${demand.longitude}#map=17/${demand.latitude}/${demand.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Ver localização no mapa
              </a>
            </div>
          )}
        </div>
        <section className="detail-section">
          <div className="detail-section-title">
            <span className="eyebrow">GESTÃO MUNICIPAL</span>
            <h3>Encaminhamento e situação</h3>
          </div>
          {isServer ? (
            <div className="assignment-form">
              <label>
                Situação
                <select
                  value={demand.status}
                  disabled={saving}
                  onChange={(e) => alterar_campo('status', e.target.value)}
                >
                  {['Pendente', 'Em andamento', 'Concluída'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Urgência
                <select
                  value={demand.urgency}
                  disabled={saving}
                  onChange={(e) => alterar_campo('urgency', e.target.value)}
                >
                  {['Baixa', 'Média', 'Alta'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              {orgs.length > 0 && (
                <label>
                  Órgão responsável
                  <select
                    value={orgId}
                    disabled={saving}
                    onChange={(e) => atribuir_orgao(e.target.value)}
                  >
                    <option value="">Manter órgão atual</option>
                    {orgs.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.nome}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          ) : (
            <p>Somente servidores podem alterar a situação, urgência e o encaminhamento.</p>
          )}
        </section>
        <section className="detail-section">
          <div className="detail-section-title">
            <span className="eyebrow">ACOMPANHAMENTO</span>
            <h3>Histórico de atualizações</h3>
          </div>
          {error && <p className="access-error">Não foi possível carregar o histórico: {error}</p>}
          <div className="timeline">
            {history.length ? (
              [...history].reverse().map((entry, index) => (
                <div className="timeline-entry" key={`${entry.date}-${index}`}>
                  <i />
                  <div>
                    <b>{entry.text}</b>
                    <small>
                      {entry.by} · {formatar_data_hora(entry.date)}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p>Nenhuma atualização registrada ainda.</p>
            )}
          </div>
          {isServer && (
            <form className="update-form" onSubmit={registrar_observacao}>
              <label htmlFor="update-note">Registrar providência adotada</label>
              <textarea
                id="update-note"
                rows="3"
                disabled={saving}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Compartilhe uma atualização com a equipe..."
              />
              <button className="button-primary" type="submit" disabled={!note.trim() || saving}>
                {saving ? 'Salvando…' : 'Adicionar ao histórico'} <span>→</span>
              </button>
            </form>
          )}
        </section>
      </article>
    </div>
  );
}
