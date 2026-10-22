import { useState } from 'react';

const links = [{ id: 'home', label: 'Visão geral' }, { id: 'demands', label: 'Demandas' }];

export function Header({ activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false);
  function navigate(id) { setActiveTab(id); setMenuOpen(false); }
  return (
    <header className="site-header">
      <div className="header-container">
        <button className="brand" onClick={() => navigate('home')} aria-label="Arcoverde Conecta, início">
          <span className="brand-mark"><img src="/logo-arcoverde.jpeg" alt="" /></span>
          <span className="brand-copy"><strong>arcoverde<span>conecta</span></strong><small>GESTÃO DE SERVIÇOS PÚBLICOS</small></span>
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}><span /><span /><span /></button>
        <nav className={`nav-buttons ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map((link) => <button key={link.id} onClick={() => navigate(link.id)} className={`nav-btn ${activeTab === link.id ? 'active' : ''}`}>{link.label}</button>)}
          <button onClick={() => navigate('profile')} className={`nav-btn nav-profile ${activeTab === 'profile' ? 'active' : ''}`} aria-label="Abrir perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.5-3.4 3.2-5.5 7-5.5s6.5 2.1 7 5.5"/></svg><span>Perfil</span></button>
          <button onClick={() => navigate('new')} className="nav-action"><span>＋</span> Registrar demanda</button>
        </nav>
      </div>
    </header>
  );
}
