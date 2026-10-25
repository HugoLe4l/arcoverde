import { useState } from 'react';

const links = [{ id: 'home', label: 'Visão geral' }];

export function Cabecalho({
  aba_ativa,
  definir_aba_ativa,
  nome_usuario,
  usuario_logado,
  tipo_usuario,
  cargo_usuario,
  ao_sair,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const primeiro_nome = nome_usuario?.trim().split(/\s+/)[0];
  const saudacao = primeiro_nome ? `Olá, ${primeiro_nome}` : 'Olá visitante';
  const link_demandas =
    tipo_usuario === 'citizen'
      ? { id: 'demands', label: 'Demandas' }
      : tipo_usuario === 'server'
        ? { id: 'serverPortal', label: 'Portal do servidor' }
        : { id: 'demands', label: 'Demandas' };
  const links_exibidos = [
    ...links,
    link_demandas,
    ...(tipo_usuario === 'citizen' ? [{ id: 'myDemands', label: 'Minhas demandas' }] : []),
  ];

  function navegar_para(id) {
    definir_aba_ativa(id);
    setMenuOpen(false);
  }
  return (
    <header className="site-header">
      <div className="header-container">
        <button
          className="brand"
          onClick={() => navegar_para('home')}
          aria-label="Arcoverde Conecta, início"
        >
          <span className="brand-mark">
            <img src="/logo-arcoverde.jpeg" alt="" />
          </span>
          <span className="brand-copy">
            <strong>
              arcoverde<span>conecta</span>
            </strong>
            <small>GESTÃO DE SERVIÇOS PÚBLICOS</small>
          </span>
        </button>
        <div className="header-actions">
          <nav
            className={`nav-buttons ${menuOpen ? 'is-open' : ''}`}
            aria-label="Navegação principal"
          >
            {links_exibidos.map((link) => (
              <button
                key={link.id}
                onClick={() => navegar_para(link.id)}
                className={`nav-btn ${aba_ativa === link.id ? 'active' : ''}`}
              >
                {link.label}
              </button>
            ))}
            {!usuario_logado && (
              <button
                onClick={() => navegar_para('access')}
                className={`nav-btn nav-access ${aba_ativa === 'access' ? 'active' : ''}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.5-3.4 3.2-5.5 7-5.5s6.5 2.1 7 5.5" />
                </svg>
                <span>Acesso</span>
              </button>
            )}
            {tipo_usuario !== 'server' && (
              <button onClick={() => navegar_para('new')} className="nav-action">
                <span>＋</span> Registrar demanda
              </button>
            )}
          </nav>
          <div className="header-user">
            {tipo_usuario !== 'server' && (
              <span className="header-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.5-3.4 3.2-5.5 7-5.5s6.5 2.1 7 5.5" />
                </svg>
              </span>
            )}
            {tipo_usuario === 'server' && cargo_usuario && (
              <span className="header-role">{cargo_usuario}</span>
            )}
            <span className="header-greeting">{saudacao}</span>
            {usuario_logado && (
              <button className="header-logout" onClick={ao_sair}>
                Sair
              </button>
            )}
          </div>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
