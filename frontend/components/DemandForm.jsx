import { useEffect, useState } from 'react';
const initial = { title: '', category: '', neighborhood: '', address: '', description: '' };
export function DemandForm({ onAddDemand, onCancel, categories = [] }) {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (categories.length && !form.category) setForm((current) => ({ ...current, category: categories[0].nome })); }, [categories, form.category]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event) { event.preventDefault(); setBusy(true); try { await onAddDemand(form); } finally { setBusy(false); } }
  return <div className="page-container form-page"><div className="page-title-row"><div><span className="eyebrow">CENTRAL DE ATENDIMENTO · NOVA SOLICITAÇÃO</span><h1>Registrar demanda<span className="heading-dot">.</span></h1><p>Registre informações claras para ajudar a equipe a priorizar e atender.</p></div></div>
    <form className="panel request-form" onSubmit={submit}>
      <div className="form-section-heading"><span className="form-step form-step-problem">✎</span><div><h2>Sobre o problema</h2><p>Descreva a necessidade observada na cidade.</p></div></div>
      <div className="form-grid"><label className="form-field span-two"><span>Resumo da demanda <i>*</i></span><input required maxLength="90" value={form.title} onChange={(e)=>set('title',e.target.value)} placeholder="Ex.: Lâmpada apagada na praça" /></label><label className="form-field"><span>Categoria <i>*</i></span><select required value={form.category} onChange={(e)=>set('category',e.target.value)}>{categories.map((x)=><option key={x.pk_id_categoria} value={x.nome}>{x.nome}</option>)}</select></label><label className="form-field"><span>Bairro <i>*</i></span><input required value={form.neighborhood} onChange={(e)=>set('neighborhood',e.target.value)} placeholder="Ex.: Centro" /></label><label className="form-field"><span>Endereço ou ponto de referência <i>*</i></span><input required value={form.address} onChange={(e)=>set('address',e.target.value)} placeholder="Rua, número ou local próximo" /></label><label className="form-field span-two"><span>Descrição detalhada <i>*</i></span><textarea required rows="4" maxLength="600" value={form.description} onChange={(e)=>set('description',e.target.value)} placeholder="O que aconteceu? Quando começou? Há algum risco imediato?" /><small className="character-count">{form.description.length}/600</small></label></div>
      <div className="form-bottom"><p><i>*</i> Campos obrigatórios.</p><div><button type="button" className="button-quiet" onClick={onCancel}>Cancelar</button><button type="submit" className="button-primary" disabled={busy || !categories.length}>{busy ? 'Enviando…' : 'Registrar solicitação'} <span>→</span></button></div></div>
    </form>
  </div>;
}
