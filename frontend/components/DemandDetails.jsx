import { useEffect, useState } from 'react';
import { api, mapDemand } from '../src/api.js';
const formatStamp = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Data indisponível' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(date); };

export function DemandDetails({ demand, onClose, onUpdate, isServer, categories = [] }) {
  const [note, setNote] = useState(''); const [history, setHistory] = useState(demand.history || []); const [error, setError] = useState(''); const [orgId, setOrgId] = useState(demand.orgId ? String(demand.orgId) : '');
  const category = categories.find((item) => item.pk_id_categoria === demand.categoryId || item.nome === demand.category);
  const orgs = category?.orgaos || [];
  useEffect(() => {
    let alive = true;
    api.demandDetails(demand.apiId).then((response) => {
      if (!alive) return;
      const result = response.resultado || {};
      setHistory((result.historico || []).map((entry) => ({ date: entry.data_atualizacao, text: entry.observacao || `Situação atualizada para ${entry.situacao_nova}.`, by: `Matrícula ${entry.fk_matricula_servidor}` })));
      const row = result.solicitacao;
      if (row) setOrgId(row.fk_id_orgao ? String(row.fk_id_orgao) : '');
    }).catch((err) => { if (alive) setError(err.message); });
    return () => { alive = false; };
  }, [demand.apiId]);
  function addNote(event) { event.preventDefault(); if (!note.trim() || !isServer) return; onUpdate(demand.id, {}, note.trim()); setNote(''); }
  function change(field, value) { if (!isServer) return; onUpdate(demand.id, { [field]: value }, `Atualização registrada: ${field === 'status' ? `situação ${value}` : `urgência ${value}`}.`); }
  function assignOrg(value) { setOrgId(value); if (!value || !isServer) return; const name = orgs.find((item) => String(item.id) === value)?.nome; onUpdate(demand.id, { orgId: Number(value) }, `Solicitação encaminhada para ${name || 'o órgão responsável'}.`); }
  return <div className="dialog-backdrop" onMouseDown={(event)=>event.target===event.currentTarget&&onClose()}><aside className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="detail-top"><span className="eyebrow">FICHA DE ATENDIMENTO</span><button className="dialog-close" onClick={onClose} aria-label="Fechar detalhes">×</button></div><span className="demand-id">{demand.id}</span><h2 id="detail-title">{demand.title}</h2><div className="detail-pills"><span className={`urgency-pill urgency-${demand.urgency.toLowerCase()}`}>Urgência {demand.urgency.toLowerCase()}</span><span className={`status-pill status-${demand.status.toLowerCase().replaceAll(' ','-')}`}>{demand.status}</span></div>
    <p className="detail-description">{demand.description}</p><div className="detail-facts"><div><small>LOCALIZAÇÃO</small><b>{demand.neighborhood}</b><span>{demand.address}</span></div><div><small>CATEGORIA</small><b>{demand.category}</b></div><div><small>ÓRGÃO RESPONSÁVEL</small><b>{demand.sector}</b></div><div><small>REGISTRADA</small><b>{formatStamp(demand.createdAt)}</b></div></div>
    <section className="detail-section"><div className="detail-section-title"><span className="eyebrow">GESTÃO MUNICIPAL</span><h3>Encaminhamento e situação</h3></div>{isServer ? <div className="assignment-form"><label>Situação<select value={demand.status} onChange={(e)=>change('status',e.target.value)}>{['Pendente','Em andamento','Concluída'].map((s)=><option key={s}>{s}</option>)}</select></label><label>Urgência<select value={demand.urgency} onChange={(e)=>change('urgency',e.target.value)}>{['Baixa','Média','Alta'].map((s)=><option key={s}>{s}</option>)}</select></label>{orgs.length > 0 && <label>Órgão responsável<select value={orgId} onChange={(e)=>assignOrg(e.target.value)}><option value="">Manter órgão atual</option>{orgs.map((org)=><option key={org.id} value={org.id}>{org.nome}</option>)}</select></label>}</div> : <p>Entre na área do servidor para alterar situação, urgência e encaminhamento.</p>}</section>
    <section className="detail-section"><div className="detail-section-title"><span className="eyebrow">ACOMPANHAMENTO</span><h3>Histórico de atualizações</h3></div>{error&&<p className="access-error">Não foi possível carregar o histórico: {error}</p>}<div className="timeline">{history.length ? [...history].reverse().map((entry,index)=><div className="timeline-entry" key={`${entry.date}-${index}`}><i/><div><b>{entry.text}</b><small>{entry.by} · {formatStamp(entry.date)}</small></div></div>) : <p>Nenhuma atualização registrada ainda.</p>}</div>{isServer&&<form className="update-form" onSubmit={addNote}><label htmlFor="update-note">Registrar providência adotada</label><textarea id="update-note" rows="3" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Compartilhe uma atualização com a equipe..." /><button className="button-primary" type="submit" disabled={!note.trim()}>Adicionar ao histórico <span>→</span></button></form>}</section></aside></div>;
}
