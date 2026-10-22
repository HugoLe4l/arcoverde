import { useState } from 'react';
import './AccessPortal.css';

function AccessFrame({ title, subtitle, onBack, children }) {
  return <section className="access-frame">
    <button className="access-back" type="button" onClick={onBack}>← Voltar</button>
    <div className="access-brand-mark"><img src="/logo-arcoverde.jpeg" alt="" /></div>
    <span className="eyebrow">ARCOVERDE CONECTA · ACESSO</span>
    <h1>{title}</h1><p className="access-subtitle">{subtitle}</p>
    {children}
  </section>;
}

export function AccessPortal({ onNavigate, onServerLogin }) {
  const [screen, setScreen] = useState('choose');
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  function returnToChoices() { setScreen('choose'); setNotice(''); setError(''); }
  function submitCitizen(event) {
    event.preventDefault(); setError('');
    if (mode === 'register') {
      const data = new FormData(event.currentTarget);
      if (data.get('password') !== data.get('confirmPassword')) { setError('As senhas não coincidem.'); return; }
      setNotice('Cadastro demonstrativo concluído. Agora você pode registrar ou acompanhar uma solicitação.');
    } else setNotice('Acesso demonstrativo liberado. Você pode registrar ou acompanhar uma solicitação.');
    setScreen('citizenDone');
  }

  if (screen === 'choose') return <div className="access-page page-container">
    <header className="access-page-heading"><span className="eyebrow">ACESSO AO SISTEMA</span><h1>Como você quer acessar?</h1><p>Escolha sua área para continuar no Arcoverde Conecta.</p></header>
    <div className="access-choice-grid">
      <button className="access-choice-card" onClick={() => { setScreen('citizen'); setMode('login'); }}>
        <span className="access-choice-icon citizen-icon" aria-hidden="true">♙</span><span className="access-choice-kicker">PARA A POPULAÇÃO</span><b>Área do cidadão</b><small>Entre na sua conta ou crie um cadastro para fazer e acompanhar solicitações.</small><span className="access-choice-action">Entrar ou cadastrar-se <i>→</i></span>
      </button>
      <button className="access-choice-card" onClick={() => setScreen('server')}>
        <span className="access-choice-icon server-icon" aria-hidden="true">▦</span><span className="access-choice-kicker">GESTÃO MUNICIPAL</span><b>Área do servidor</b><small>Acesse o painel de atendimento para organizar e atualizar as demandas.</small><span className="access-choice-action">Acessar portal do servidor <i>→</i></span>
      </button>
    </div>
  </div>;

  if (screen === 'citizenDone') return <div className="access-page page-container"><AccessFrame title="Tudo pronto para continuar" subtitle={notice} onBack={returnToChoices}>
    <div className="access-success-mark" aria-hidden="true">✓</div>
    <div className="access-success-actions"><button className="button-primary" onClick={() => onNavigate('new')}>Registrar uma solicitação</button><button className="access-secondary-button" onClick={() => onNavigate('demands')}>Acompanhar solicitações</button></div>
  </AccessFrame></div>;

  if (screen === 'citizen') return <div className="access-page page-container"><AccessFrame title={mode === 'login' ? 'Bem-vindo de volta' : 'Crie seu cadastro'} subtitle={mode === 'login' ? 'Entre para registrar e acompanhar solicitações da cidade.' : 'Preencha seus dados para começar a usar o portal do cidadão.'} onBack={returnToChoices}>
    <div className="access-mode-tabs" role="tablist" aria-label="Acesso do cidadão"><button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError(''); }}>Entrar</button><button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setError(''); }}>Criar cadastro</button></div>
    <form className="access-form" onSubmit={submitCitizen}>
      {mode === 'register' && <label>Nome completo<input name="name" required autoComplete="name" placeholder="Como podemos chamar você?" maxLength={80} /></label>}
      <label>E-mail<input name="email" type="email" required autoComplete="email" placeholder="voce@exemplo.com" maxLength={120} /></label>
      {mode === 'register' && <label>Telefone <span className="access-optional">opcional</span><input name="phone" type="tel" autoComplete="tel" placeholder="(87) 9 0000-0000" maxLength={20} /></label>}
      <label>Senha<input name="password" type="password" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={4} placeholder="Digite sua senha" /></label>
      {mode === 'register' && <label>Confirme sua senha<input name="confirmPassword" type="password" required autoComplete="new-password" minLength={4} placeholder="Digite a senha novamente" /></label>}
      {error && <p className="access-error" role="alert">{error}</p>}
      <button className="button-primary access-submit" type="submit">{mode === 'login' ? 'Entrar como cidadão' : 'Criar cadastro demonstrativo'} <span>→</span></button>
    </form>
  </AccessFrame></div>;

  return <div className="access-page page-container"><AccessFrame title="Acesso do servidor" subtitle="Entre no portal de gestão para atender e atualizar as solicitações." onBack={returnToChoices}>
    <form className="access-form" onSubmit={(event) => { event.preventDefault(); onServerLogin(); }}>
      <label>E-mail institucional<input type="email" required autoComplete="username" placeholder="servidor@arcoverde.pe.gov.br" /></label>
      <label>Senha<input type="password" required autoComplete="current-password" minLength={4} placeholder="Digite sua senha" /></label>
      <button className="button-primary access-submit" type="submit">Entrar no portal <span>→</span></button>
    </form>
  </AccessFrame></div>;
}
