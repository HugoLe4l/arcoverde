import { useMemo, useState } from 'react';

export function DemandsList({ demands, onOpenDemand, onAdd }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Todas');
  const [category, setCategory] = useState('Todas');
  const [urgency, setUrgency] = useState('Todas');
  const categories = [...new Set(demands.map((d) => d.category))];
  const filtered = useMemo(() => demands.filter((d) => {
    const query = `${d.id} ${d.title} ${d.neighborhood} ${d.address} ${d.category}`.toLocaleLowerCase('pt-BR');
    return query.includes(search.toLocaleLowerCase('pt-BR')) && (status === 'Todas' || d.status === status) && (category === 'Todas' || d.category === category) && (urgency === 'Todas' || d.urgency === urgency);
  }), [demands, search, status, category, urgency]);
  return <div className="page-container demands-page">
    <section className="page-title-row"><div><span className="eyebrow">GESTÃO INTEGRADA · SERVIÇOS MUNICIPAIS</span><h1>Central de demandas<span className="heading-dot">.</span></h1><p>Consulte solicitações, acompanhe o histórico e ajude a organizar o atendimento.</p></div><button className="button-primary" onClick={onAdd}><span>＋</span> Registrar demanda</button></section>
    <section className="queue-summary"><div><span>NA FILA</span><b>{demands.filter((d) => d.status !== 'Concluída').length}</b></div><div><span>ALTA URGÊNCIA</span><b>{demands.filter((d) => d.urgency === 'Alta' && d.status !== 'Concluída').length}</b></div><div><span>COM PRAZO VENCIDO</span><b>{demands.filter((d) => d.status !== 'Concluída' && d.dueDate && d.dueDate < new Date().toISOString().slice(0,10)).length}</b></div></section>
    <section className="panel queue-panel"><div className="queue-toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por assunto, bairro ou ID" /><kbd>⌘ K</kbd></label><div className="filter-selects"><label><span>SITUAÇÃO</span><select value={status} onChange={(e) => setStatus(e.target.value)}>{['Todas','Pendente','Aguardando equipe','Em andamento','Concluída'].map((x) => <option key={x}>{x}</option>)}</select></label><label><span>CATEGORIA</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todas</option>{categories.map((x) => <option key={x}>{x}</option>)}</select></label><label><span>URGÊNCIA</span><select value={urgency} onChange={(e) => setUrgency(e.target.value)}>{['Todas','Alta','Média','Baixa'].map((x) => <option key={x}>{x}</option>)}</select></label></div></div>
      <div className="queue-list-head"><span>SOLICITAÇÃO</span><span>LOCALIZAÇÃO</span><span>PRIORIDADE</span><span>SITUAÇÃO</span><span>RESPONSÁVEL</span><span /></div>
      <div className="queue-list">{filtered.map((d) => <button className={`queue-row ${d.urgency === 'Alta' && d.status !== 'Concluída' ? 'is-high-urgency' : ''}`} key={d.id} onClick={() => onOpenDemand(d.id)}><span className="queue-subject"><i className="subject-icon">{d.category==='Iluminação'?'☼':d.category==='Saneamento'?'≈':d.category==='Limpeza urbana'?'✳':'⌁'}</i><span><b>{d.title}</b><small>{d.id} · {d.category}</small></span></span><span className="queue-location"><b>{d.neighborhood}</b><small>{d.address}</small></span><span><i className={`urgency-pill urgency-${d.urgency.toLowerCase()}`}>{d.urgency}</i></span><span><i className={`status-pill status-${d.status.toLowerCase().replaceAll(' ', '-')}`}>{d.status}</i></span><span className="queue-owner">{d.responsible || 'A definir'}</span><span className="row-arrow">↗</span></button>)}{filtered.length===0&&<div className="empty-queue"><span>⌕</span><b>Nenhuma demanda encontrada</b><p>Ajuste a busca ou os filtros para ver outras solicitações.</p><button onClick={() => {setSearch('');setStatus('Todas');setCategory('Todas');setUrgency('Todas');}}>Limpar filtros</button></div>}</div>
      <div className="queue-footer">Exibindo <b>{filtered.length}</b> de <b>{demands.length}</b> solicitações <span>Informações fictícias para demonstração acadêmica</span></div>
    </section>
  </div>;
}
