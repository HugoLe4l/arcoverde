import { IntroducaoArcoverde } from '../components/ArcoverdeIntro.jsx';
import { MapaSolicitacoes } from '../components/DemandMap.jsx';
const formatar_data = (value) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value));

function CartaoMetrica({ icon, label, value, note, tone }) {
  return (
    <article className="metric-card">
      <span className={`metric-icon ${tone}`}>{icon}</span>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </article>
  );
}

export function PaginaInicial({ demands, metrics, ao_abrir_solicitacao, ao_navegar }) {
  const recent = [...demands]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const progress = metrics.total ? Math.round((metrics.done / metrics.total) * 100) : 0;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-guide" aria-label="Guia das seções do painel">
        <div className="guide-brand">
          <h2>Explore o painel</h2>
        </div>
        <nav aria-label="Navegação pelas seções">
          <a className="guide-featured" href="#cidade">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01" />
            </svg>
            <span className="guide-link-copy">
              <b>Arcoverde e a proposta</b>
            </span>
          </a>
          <a href="#overview">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="13" y="3" width="8" height="5" rx="1.5" />
              <rect x="13" y="10" width="8" height="11" rx="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
            </svg>
            <span className="guide-link-copy">
              <b>Visão geral</b>
            </span>
          </a>
          <a href="#territory">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="guide-link-copy">
              <b>Mapa por bairro</b>
            </span>
          </a>
          <a href="#recent">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 4H5a2 2 0 0 0-2 2v15h18V6a2 2 0 0 0-2-2h-3M8 3h8v4H8zM7 12h10M7 16h10" />
            </svg>
            <span className="guide-link-copy">
              <b>Solicitações</b>
            </span>
          </a>
          <a href="#purpose">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
            </svg>
            <span className="guide-link-copy">
              <b>Por trás do projeto</b>
            </span>
          </a>
          <a href="#how">
            <svg className="guide-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="5" cy="6" r="2" />
              <circle cx="19" cy="18" r="2" />
              <path d="M7 6h5a3 3 0 0 1 0 6h-1a3 3 0 0 0 0 6h6" />
            </svg>
            <span className="guide-link-copy">
              <b>Como funciona</b>
            </span>
          </a>
        </nav>
      </aside>
      <main className="page-container dashboard-page">
        <section className="hero-section" id="home">
          <div className="hero-backdrop" />
          <div className="hero-content">
            <span className="hero-kicker">
              <span className="hero-kicker-label">PAINEL MUNICIPAL</span>
              <em className="hero-kicker-place">ARCOVERDE</em>
              <span className="hero-kicker-state">PE</span>
            </span>
            <h1>
              Uma cidade melhor
              <br />
              <em>começa por cada demanda.</em>
            </h1>
            <p>
              Organize solicitações, acompanhe os serviços e ajude as equipes a priorizar o que mais
              importa.
            </p>
            <div className="hero-actions">
              <button className="hero-button" onClick={() => ao_navegar('demands')}>
                Acompanhar demandas <span>→</span>
              </button>
              <button className="hero-link" onClick={() => ao_navegar('new')}>
                ＋ Nova solicitação
              </button>
            </div>
          </div>
          <div className="hero-logo-card">
            <img
              src="/logo-arcoverde.jpeg"
              alt="Prefeitura de Arcoverde — Cidade forte novamente"
            />
          </div>
          <span className="hero-credit">UMA REDE DE CUIDADO PARA A CIDADE</span>
        </section>
        <IntroducaoArcoverde ao_navegar={ao_navegar} />
        <div className="section-heading" id="overview">
          <div>
            <span className="eyebrow">ACOMPANHAMENTO EM TEMPO REAL</span>
            <h2>
              Visão geral <span className="heading-dot">.</span>
            </h2>
            <p>Um resumo da fila de serviços e das prioridades da equipe.</p>
          </div>
        </div>
        <section className="metrics-grid" aria-label="Resumo das demandas">
          <CartaoMetrica
            icon="▤"
            label="Demandas registradas"
            value={metrics.total}
            note="na base integrada"
            tone="blue"
          />
          <CartaoMetrica
            icon="◷"
            label="Em acompanhamento"
            value={metrics.active}
            note="aguardando atendimento"
            tone="amber"
          />
          <CartaoMetrica
            icon="↗"
            label="Alta urgência"
            value={metrics.urgent}
            note="prioridade de análise"
            tone="coral"
          />
          <CartaoMetrica
            icon="✓"
            label="Concluídas"
            value={`${progress}%`}
            note={`${metrics.done} serviço${metrics.done === 1 ? '' : 's'} finalizado${metrics.done === 1 ? '' : 's'}`}
            tone="green"
          />
        </section>
        <section className="dashboard-grid">
          <article className="panel territory-panel" id="territory">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">DISTRIBUIÇÃO TERRITORIAL</span>
                <h3>Demandas por bairro</h3>
              </div>
              <span className="illustrative-tag">SOLICITAÇÕES EM ABERTO</span>
            </div>
            <div className="territory-body map-only">
              <MapaSolicitacoes demandas={demands} />
            </div>
          </article>

          <article className="panel priority-panel" id="priority">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">PONTOS DE ATENÇÃO</span>
                <h3>Prioridade da equipe</h3>
              </div>
              <span className="priority-spark">✳</span>
            </div>
            <div className="attention-summary">
              <strong>{metrics.urgent}</strong>
              <span>solicitações de alta urgência ainda abertas</span>
            </div>
            {metrics.overdue > 0 && (
              <div className="late-callout">
                <span>!</span>
                <p>
                  <b>
                    {metrics.overdue} demanda{metrics.overdue === 1 ? '' : 's'} com prazo vencido
                  </b>
                  <small>Revise o encaminhamento e as providências.</small>
                </p>
              </div>
            )}
            <div className="completion-row">
              <span>Serviços concluídos</span>
              <b>{progress}%</b>
            </div>
            <div className="completion-track">
              <i style={{ width: `${progress}%` }} />
            </div>
            <button className="panel-link" onClick={() => ao_navegar('demands')}>
              Abrir fila de atendimento <span>→</span>
            </button>
          </article>
        </section>
        <section className="panel recent-panel" id="recent">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">CENTRAL DE ATENDIMENTO</span>
              <h3>Solicitações recentes</h3>
            </div>
            <button className="panel-link heading-link" onClick={() => ao_navegar('demands')}>
              Ver todas <span>→</span>
            </button>
          </div>
          <div className="recent-list">
            {recent.map((demand) => (
              <button
                className="recent-item"
                key={demand.id}
                onClick={() => ao_abrir_solicitacao(demand.id)}
              >
                <span className="recent-category">
                  {demand.category === 'Iluminação'
                    ? '☼'
                    : demand.category === 'Limpeza urbana'
                      ? '✳'
                      : '⌁'}
                </span>
                <span className="recent-main">
                  <b>{demand.title}</b>
                  <small>
                    {demand.id} · {demand.neighborhood}
                  </small>
                </span>
                <span
                  className={`status-pill status-${demand.status.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {demand.status}
                </span>
                <span className={`urgency-pill urgency-${demand.urgency.toLowerCase()}`}>
                  {demand.urgency}
                </span>
                <span className="recent-date">{formatar_data(demand.createdAt)}</span>
                <span className="recent-arrow">↗</span>
              </button>
            ))}
            {recent.length === 0 && (
              <p className="empty-small">Ainda não há solicitações registradas.</p>
            )}
          </div>
        </section>
        <section className="purpose-section" id="purpose" aria-labelledby="purpose-title">
          <div className="purpose-copy">
            <span className="eyebrow">POR TRÁS DO PROJETO</span>
            <h2 id="purpose-title">Uma cidade melhor começa com escuta e organização.</h2>
            <p>
              O Arcoverde Conecta nasceu do desafio de integrar e priorizar as demandas de serviços
              públicos do município. Quando uma solicitação se perde entre canais, fica mais difícil
              acompanhar o atendimento e perceber quais necessidades pedem atenção primeiro.
            </p>
            <p>
              A proposta é reunir as informações em um só lugar e oferecer uma visão clara das
              demandas por serviço, bairro, urgência e andamento, apoiando equipes públicas no
              planejamento do atendimento à população.
            </p>
          </div>
          <div className="purpose-pillars" aria-label="Como a proposta ajuda">
            <article>
              <span>01</span>
              <div>
                <b>Escuta organizada</b>
                <p>Solicitações reunidas com informações úteis para encaminhamento.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <b>Prioridades visíveis</b>
                <p>Urgência, localização e andamento apresentados com clareza.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <b>Acompanhamento próximo</b>
                <p>Uma visão compartilhada para apoiar respostas mais coordenadas.</p>
              </div>
            </article>
          </div>
        </section>
        <section className="how-section" id="how" aria-labelledby="how-title">
          <div className="how-heading">
            <span className="eyebrow">COMO FUNCIONA</span>
            <h2 id="how-title">Do registro ao acompanhamento, em três passos.</h2>
            <p>
              Um caminho simples para a população registrar necessidades e consultar o andamento dos
              serviços.
            </p>
          </div>
          <div className="how-layout">
            <ol className="how-steps">
              <li>
                <span className="how-step-number">01</span>
                <div>
                  <h3>Registre a solicitação</h3>
                  <p>
                    Informe o serviço, o bairro e o que precisa de atenção. Uma descrição clara
                    ajuda a equipe a entender a situação.
                  </p>
                </div>
              </li>
              <li>
                <span className="how-step-number">02</span>
                <div>
                  <h3>A equipe organiza as demandas</h3>
                  <p>
                    As solicitações ficam reunidas para consulta e análise por localização,
                    categoria, urgência e situação.
                  </p>
                </div>
              </li>
              <li>
                <span className="how-step-number">03</span>
                <div>
                  <h3>Acompanhe o andamento</h3>
                  <p>Consulte a fila e veja as atualizações registradas ao longo do atendimento.</p>
                </div>
              </li>
            </ol>
            <div
              className="how-illustration"
              role="img"
              aria-label="Ilustração de um mapa da cidade com uma solicitação registrada e encaminhada"
            >
              <svg viewBox="0 0 480 320" aria-hidden="true">
                <ellipse cx="71" cy="65" rx="62" ry="48" className="illustration-park" />
                <ellipse cx="400" cy="248" rx="73" ry="48" className="illustration-park" />
                <ellipse cx="282" cy="38" rx="52" ry="34" className="illustration-park" />
                <g className="illustration-blocks">
                  <rect x="130" y="29" width="52" height="34" rx="7" />
                  <rect x="205" y="34" width="44" height="29" rx="7" />
                  <rect x="298" y="44" width="45" height="31" rx="7" />
                  <rect x="24" y="139" width="48" height="33" rx="7" />
                  <rect x="105" y="126" width="46" height="30" rx="7" />
                  <rect x="267" y="137" width="48" height="34" rx="7" />
                  <rect x="390" y="127" width="49" height="34" rx="7" />
                  <rect x="52" y="225" width="50" height="32" rx="7" />
                  <rect x="176" y="240" width="51" height="33" rx="7" />
                  <rect x="320" y="228" width="47" height="31" rx="7" />
                </g>
                <g className="illustration-local-roads">
                  <path d="M-10 106 C92 117 123 99 187 108 S330 125 490 96" />
                  <path d="M-10 190 C87 177 121 191 203 180 S358 166 490 190" />
                  <path d="M98 -15 C116 58 103 114 122 172 S146 272 132 335" />
                  <path d="M250 -15 C232 60 258 117 245 183 S236 267 251 335" />
                  <path d="M352 -15 C369 58 340 117 357 184 S377 270 361 335" />
                </g>
                <g className="illustration-main-roads">
                  <path d="M-20 83 C80 99 118 40 215 63 S352 116 502 58" />
                  <path d="M45 -20 C77 60 118 97 160 150 S221 240 283 344" />
                  <path d="M356 -20 C328 53 371 111 342 168 S354 242 424 338" />
                  <path d="M-20 242 C68 213 129 253 207 216 S345 191 502 224" />
                </g>
                <path
                  d="M46 225 C115 214 151 163 214 158 S321 179 389 113"
                  className="illustration-route"
                />
                <circle cx="389" cy="113" r="28" className="illustration-pulse" />
                <path
                  d="M354 112 C354 92 370 79 389 79s35 13 35 33c0 23-35 56-35 56s-35-33-35-56"
                  className="illustration-pin"
                />
                <circle cx="389" cy="112" r="10" className="illustration-pin-center" />
                <circle cx="155" cy="175" r="7" className="illustration-secondary-pin" />
                <circle cx="155" cy="175" r="17" className="illustration-secondary-pulse" />
                <g className="illustration-map-label">
                  <rect x="54" y="125" width="82" height="22" rx="6" />
                  <text x="95" y="140" textAnchor="middle">
                    CENTRO
                  </text>
                </g>
                <g className="illustration-map-label">
                  <rect x="285" y="194" width="116" height="22" rx="6" />
                  <text x="343" y="209" textAnchor="middle">
                    SÃO CRISTÓVÃO
                  </text>
                </g>
              </svg>
              <div className="how-float-card">
                <span className="how-card-icon">✓</span>
                <div>
                  <b>Solicitação encaminhada</b>
                  <span>Arcoverde · equipe responsável</span>
                </div>
              </div>
              <span className="how-illustration-caption">Uma visão conectada da cidade</span>
            </div>
          </div>
        </section>{' '}
      </main>
    </div>
  );
}
