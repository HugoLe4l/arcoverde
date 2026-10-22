import { useState } from 'react';

const categories = ['Infraestrutura','Iluminação','Limpeza urbana','Saneamento','Meio ambiente','Saúde','Educação','Outro'];
const initial = { title: '', category: 'Infraestrutura', neighborhood: '', address: '', description: '', urgency: 'Média', reach: 'Ponto isolado', photo: '' };

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Escolha uma imagem JPG, PNG ou WebP válida.'));
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', .72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function DemandForm({ onAddDemand, onCancel }) {
  const [form, setForm] = useState(initial);
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  async function handlePhoto(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setPhotoError('');
    if (!file.type.startsWith('image/')) { setPhotoError('Selecione um arquivo de imagem.'); return; }
    if (file.size > 12 * 1024 * 1024) { setPhotoError('A imagem deve ter até 12 MB.'); return; }
    try { set('photo', await compressPhoto(file)); setPhotoName(file.name); }
    catch (error) { setPhotoError(error.message); }
  }
  function submit(event) { event.preventDefault(); onAddDemand(form); }

  return <div className="page-container form-page">
    <div className="page-title-row"><div><span className="eyebrow">CENTRAL DE ATENDIMENTO · NOVA SOLICITAÇÃO</span><h1>Registrar demanda<span className="heading-dot">.</span></h1><p>Registre informações claras para ajudar a equipe a priorizar e atender.</p></div><span className="safe-tag">◇ &nbsp; Demonstração com dados fictícios</span></div>
    <form className="panel request-form" onSubmit={submit}>
      <div className="form-section-heading"><span className="form-step">01</span><div><h2>Sobre o problema</h2><p>Descreva a necessidade observada na cidade.</p></div></div>
      <div className="form-grid"><label className="form-field span-two"><span>Resumo da demanda <i>*</i></span><input required maxLength="90" value={form.title} onChange={(e)=>set('title',e.target.value)} placeholder="Ex.: Lâmpada apagada na praça" /></label><label className="form-field"><span>Categoria <i>*</i></span><select required value={form.category} onChange={(e)=>set('category',e.target.value)}>{categories.map((x)=><option key={x}>{x}</option>)}</select></label><label className="form-field"><span>Urgência <i>*</i></span><select required value={form.urgency} onChange={(e)=>set('urgency',e.target.value)}><option>Baixa</option><option>Média</option><option>Alta</option></select><small>Considere o risco e a quantidade de pessoas afetadas.</small></label><label className="form-field"><span>Bairro <i>*</i></span><input required value={form.neighborhood} onChange={(e)=>set('neighborhood',e.target.value)} placeholder="Ex.: Centro" /></label><label className="form-field"><span>Endereço ou ponto de referência <i>*</i></span><input required value={form.address} onChange={(e)=>set('address',e.target.value)} placeholder="Rua, número ou local próximo" /></label><label className="form-field"><span>Alcance do problema <i>*</i></span><select required value={form.reach} onChange={(e)=>set('reach',e.target.value)}><option>Ponto isolado</option><option>Afeta uma rua</option><option>Afeta um quarteirão</option><option>Afeta vários bairros</option></select></label><label className="form-field span-two"><span>Descrição detalhada <i>*</i></span><textarea required rows="4" maxLength="600" value={form.description} onChange={(e)=>set('description',e.target.value)} placeholder="O que aconteceu? Quando começou? Há algum risco imediato?" /><small className="character-count">{form.description.length}/600</small></label></div>
      <div className="form-divider" />
      <div className="form-section-heading"><span className="form-step">02</span><div><h2>Imagem de apoio</h2><p>Uma fotografia ajuda a equipe a entender o local. Evite incluir rostos ou dados pessoais.</p></div></div>
      <label className={`photo-upload ${form.photo?'has-photo':''}`}><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /><span className="upload-symbol">{form.photo?'✓':'＋'}</span><span><b>{photoName || 'Adicionar fotografia'}</b><small>{photoError || (form.photo ? 'Imagem anexada à solicitação' : 'JPG, PNG ou WebP · até 12 MB')}</small></span>{form.photo&&<img src={form.photo} alt="Prévia da fotografia anexada" />}</label>
      <div className="form-bottom"><p><i>*</i> Campos obrigatórios · dados desta demonstração ficam somente neste navegador.</p><div><button type="button" className="button-quiet" onClick={onCancel}>Cancelar</button><button type="submit" className="button-primary">Registrar solicitação <span>→</span></button></div></div>
    </form>
  </div>;
}
