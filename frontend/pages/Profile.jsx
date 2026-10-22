import { useEffect, useState } from 'react';

const PROFILE_STORAGE_KEY = 'arcoverde-conecta-profile-v1';
const emptyProfile = { name: '', email: '', phone: '', neighborhood: '', preferredContact: 'E-mail' };
const neighborhoods = ['Centro', 'Boa Vista', 'Boa Esperança', 'São Cristóvão', 'São Geraldo', 'Tamboril', 'Outro'];

export function Profile() {
  const [profile, setProfile] = useState(emptyProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY));
      if (stored && typeof stored === 'object') setProfile({ ...emptyProfile, ...stored });
    } catch { /* Keep the empty demo profile if browser storage is unavailable. */ }
  }, []);

  function updateField(event) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  }

  function saveProfile(event) {
    event.preventDefault();
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }

  const initials = profile.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'AC';

  return (
    <div className="page-container profile-page">
      <div className="profile-page-heading">
        <div><span className="eyebrow">ÁREA DO CIDADÃO</span><h1>Meu perfil</h1><p>Gerencie as informações usadas para acompanhar suas solicitações.</p></div>
        <span className="profile-demo-tag">PERFIL DE DEMONSTRAÇÃO</span>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-avatar" aria-label={`Iniciais: ${initials}`}>{initials}</div>
          <h2>{profile.name.trim() || 'Seu nome'}</h2>
          <p>{profile.neighborhood || 'Seu bairro em Arcoverde'}</p>
          <span className="profile-summary-divider" />
          <div className="profile-summary-note"><span aria-hidden="true">✓</span><p>Suas informações ajudam a identificar e organizar suas solicitações nesta demonstração.</p></div>
          <div className="profile-local-note"><b>Armazenamento local</b><small>Os dados ficam somente neste navegador. Não são enviados à Prefeitura.</small></div>
        </aside>

        <section className="profile-form-card" aria-labelledby="profile-form-title">
          <div className="profile-form-heading"><span className="profile-form-icon" aria-hidden="true">◎</span><div><h2 id="profile-form-title">Informações pessoais</h2><p>Preencha ou atualize seus dados de contato.</p></div></div>
          <form onSubmit={saveProfile}>
            <div className="profile-fields-grid">
              <label className="profile-field profile-field-wide">Nome completo<input name="name" value={profile.name} onChange={updateField} placeholder="Ex.: Maria da Silva" autoComplete="name" maxLength={80} /></label>
              <label className="profile-field">E-mail<input type="email" name="email" value={profile.email} onChange={updateField} placeholder="voce@exemplo.com" autoComplete="email" maxLength={120} /></label>
              <label className="profile-field">Telefone (opcional)<input type="tel" name="phone" value={profile.phone} onChange={updateField} placeholder="(87) 9 0000-0000" autoComplete="tel" maxLength={20} /></label>
              <label className="profile-field">Bairro<select name="neighborhood" value={profile.neighborhood} onChange={updateField}><option value="">Selecione seu bairro</option>{neighborhoods.map((name) => <option key={name}>{name}</option>)}</select></label>
              <label className="profile-field">Contato preferencial<select name="preferredContact" value={profile.preferredContact} onChange={updateField}><option>E-mail</option><option>Telefone</option></select></label>
            </div>
            <div className="profile-form-footer"><p>Campos opcionais no protótipo. Não informe dados sensíveis.</p><div>{saved && <span className="profile-saved" role="status">Perfil salvo neste navegador.</span>}<button className="button-primary" type="submit">Salvar perfil</button></div></div>
          </form>
        </section>
      </div>
    </div>
  );
}
