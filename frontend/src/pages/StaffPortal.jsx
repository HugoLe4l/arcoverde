import { useEffect, useMemo, useState } from 'react';
import { ListaSolicitacoes } from '../components/DemandsList.jsx';
import {
  cadastrar_servidor,
  listar_orgaos,
  listar_servidores,
  promover_servidor,
} from '../services/api.js';
import './AccessPortal.css';

export function PortalServidor({ demands, ao_navegar, ao_abrir_solicitacao, servidor, token }) {
  const [secao_ativa, set_secao_ativa] = useState('overview');
  const [cadastro_em_andamento, set_cadastro_em_andamento] = useState(false);
  const [mensagem_cadastro, set_mensagem_cadastro] = useState('');
  const [erro_cadastro, set_erro_cadastro] = useState('');
  const [promocao_em_andamento, set_promocao_em_andamento] = useState(false);
  const [mensagem_promocao, set_mensagem_promocao] = useState('');
  const [erro_promocao, set_erro_promocao] = useState('');
  const [servidores, set_servidores] = useState([]);
  const [servidores_carregando, set_servidores_carregando] = useState(false);
  const [erro_lista_servidores, set_erro_lista_servidores] = useState('');
  const [orgaos, set_orgaos] = useState([]);
  const [orgaos_carregando, set_orgaos_carregando] = useState(true);
  const [erro_orgaos, set_erro_orgaos] = useState('');
  const pode_cadastrar_servidor = ['Admin', 'Gestor'].includes(servidor?.role);
  const active = demands.filter((demand) => demand.status !== 'Concluída');
  const abertas = demands.filter(
    (demand) => demand.status === 'Pendente' || demand.status === 'Aguardando equipe',
  );
  const em_andamento = demands.filter((demand) => demand.status === 'Em andamento');
  const orgaos_com_encaminhamentos = new Set(
    active.map((demand) => demand.orgId).filter((orgao_id) => orgao_id != null),
  );
  const contagens_por_orgao = useMemo(
    () =>
      demands.reduce((contagens, demand) => {
        if (demand.status === 'Concluída' || demand.orgId == null) return contagens;
        const orgao_id = String(demand.orgId);
        contagens.set(orgao_id, (contagens.get(orgao_id) || 0) + 1);
        return contagens;
      }, new Map()),
    [demands],
  );

  useEffect(() => {
    let ativo = true;

    async function carregar_orgaos() {
      try {
        const resposta = await listar_orgaos();
        if (!Array.isArray(resposta.data)) {
          throw new Error('A API retornou uma lista de órgãos inválida.');
        }
        if (ativo) set_orgaos(resposta.data);
      } catch (error) {
        if (ativo) set_erro_orgaos(error.message);
      } finally {
        if (ativo) set_orgaos_carregando(false);
      }
    }

    carregar_orgaos();
    return () => {
      ativo = false;
    };
  }, []);

  async function carregar_servidores() {
    set_servidores_carregando(true);
    set_erro_lista_servidores('');

    try {
      const resposta = await listar_servidores(token);
      if (!Array.isArray(resposta.data)) {
        throw new Error('A API retornou uma lista de servidores inválida.');
      }
      set_servidores(resposta.data);
    } catch (error) {
      set_erro_lista_servidores(error.message);
    } finally {
      set_servidores_carregando(false);
    }
  }

  function abrir_central_gestor() {
    set_secao_ativa('management');
    carregar_servidores();
  }

  async function enviar_cadastro_servidor(event) {
    event.preventDefault();
    set_mensagem_cadastro('');
    set_erro_cadastro('');

    const formulario = event.currentTarget;
    const dados = new FormData(formulario);
    const matricula = Number(dados.get('matricula'));
    const nome = String(dados.get('nome') || '').trim();
    const senha_recebida = String(dados.get('senha_recebida') || '');

    if (!Number.isSafeInteger(matricula) || matricula <= 0 || !nome || !senha_recebida) {
      set_erro_cadastro('Informe uma matrícula válida, o nome e a senha inicial.');
      return;
    }

    set_cadastro_em_andamento(true);
    try {
      await cadastrar_servidor({ matricula, nome, senha_recebida }, token);
      formulario.reset();
      set_mensagem_cadastro('Atendente cadastrado com sucesso.');
      await carregar_servidores();
    } catch (error) {
      set_erro_cadastro(error.message);
    } finally {
      set_cadastro_em_andamento(false);
    }
  }

  async function enviar_promocao_gestor(event) {
    event.preventDefault();
    set_mensagem_promocao('');
    set_erro_promocao('');

    const formulario = event.currentTarget;
    const dados = new FormData(formulario);
    const matricula = Number(dados.get('matricula_gestor'));

    if (!Number.isSafeInteger(matricula) || matricula <= 0) {
      set_erro_promocao('Informe uma matrícula válida.');
      return;
    }

    set_promocao_em_andamento(true);
    try {
      await promover_servidor({ matricula }, token);
      formulario.reset();
      set_mensagem_promocao(
        'Servidor promovido a Gestor. O servidor promovido precisa entrar novamente para atualizar o acesso.',
      );
      await carregar_servidores();
    } catch (error) {
      set_erro_promocao(error.message);
    } finally {
      set_promocao_em_andamento(false);
    }
  }

  return (
    <div className="staff-portal page-container">
      <div className="staff-workspace">
        <aside className="staff-sidebar">
          <span className="staff-sidebar-label">MENU DO SERVIDOR</span>
          <nav aria-label="Menu do portal do servidor">
            <button
              className={secao_ativa === 'overview' ? 'active' : ''}
              aria-current={secao_ativa === 'overview' ? 'page' : undefined}
              onClick={() => set_secao_ativa('overview')}
            >
              <span aria-hidden="true">▦</span>
              Visão geral
            </button>
            <button
              className={secao_ativa === 'requests' ? 'active' : ''}
              aria-current={secao_ativa === 'requests' ? 'page' : undefined}
              onClick={() => set_secao_ativa('requests')}
            >
              <span aria-hidden="true">☷</span>
              Solicitações
            </button>
            {pode_cadastrar_servidor && (
              <button
                className={secao_ativa === 'management' ? 'active' : ''}
                aria-current={secao_ativa === 'management' ? 'page' : undefined}
                onClick={abrir_central_gestor}
              >
                <span aria-hidden="true">＋</span>
                Central do gestor
              </button>
            )}
          </nav>
        </aside>
        <div className="staff-main">
          {secao_ativa === 'overview' ? (
            <>
              <header className="staff-portal-heading">
                <div>
                  <span className="eyebrow">ÁREA DE GESTÃO MUNICIPAL</span>
                  <h1>
                    Visão geral<span className="heading-dot">.</span>
                  </h1>
                  <p>
                    {servidor?.nome ? `Olá, ${servidor.nome}. ` : ''}
                    Acompanhe o resumo das solicitações registradas na base municipal.
                  </p>
                </div>
              </header>
              <section className="staff-overview" aria-label="Resumo da fila de atendimento">
                <article>
                  <span>Solicitações abertas</span>
                  <b>{abertas.length}</b>
                  <small>aguardando atendimento</small>
                </article>
                <article>
                  <span>Em andamento</span>
                  <b>{em_andamento.length}</b>
                  <small>em atendimento</small>
                </article>
                <article>
                  <span>Órgãos com encaminhamentos</span>
                  <b>{orgaos_com_encaminhamentos.size}</b>
                  <small>com solicitações não concluídas</small>
                </article>
                <article>
                  <span>Concluídas</span>
                  <b>{demands.length - active.length}</b>
                  <small>atendimentos finalizados</small>
                </article>
              </section>
              <section className="staff-org-overview" aria-labelledby="staff-org-overview-title">
                <div className="staff-org-overview-heading">
                  <div>
                    <span className="eyebrow">DISTRIBUIÇÃO DA FILA</span>
                    <h2 id="staff-org-overview-title">Solicitações por órgão</h2>
                    <p>Solicitações atribuídas que ainda não foram concluídas.</p>
                  </div>
                </div>
                {orgaos_carregando ? (
                  <p className="staff-org-overview-message">Carregando órgãos…</p>
                ) : erro_orgaos ? (
                  <p className="staff-org-overview-error" role="alert">
                    Não foi possível carregar os órgãos: {erro_orgaos}
                  </p>
                ) : orgaos.length === 0 ? (
                  <p className="staff-org-overview-message">Nenhum órgão cadastrado.</p>
                ) : (
                  <div className="staff-org-overview-grid">
                    {orgaos.map((orgao) => (
                      <article className="staff-org-card" key={orgao.pk_id_orgao}>
                        <span>{orgao.nome}</span>
                        <b>{contagens_por_orgao.get(String(orgao.pk_id_orgao)) || 0}</b>
                        <small>não concluídas</small>
                      </article>
                    ))}
                  </div>
                )}
              </section>
              <section className="panel staff-overview-note">
                <span className="eyebrow">CENTRAL DE ATENDIMENTO</span>
                <h2>Gerencie as solicitações da cidade</h2>
                <p>
                  Consulte a fila para atualizar situações, definir prioridades, encaminhar
                  solicitações aos órgãos responsáveis e registrar providências.
                </p>
                <button className="button-primary" onClick={() => set_secao_ativa('requests')}>
                  Abrir solicitações <span>→</span>
                </button>
              </section>
            </>
          ) : secao_ativa === 'requests' ? (
            <>
              <div className="staff-queue-heading">
                <div>
                  <span className="eyebrow">CENTRAL DE ATENDIMENTO</span>
                  <h1>Solicitações</h1>
                  <p>
                    Atualize situação, urgência, órgão responsável e registre providências no
                    histórico.
                  </p>
                </div>
              </div>
              <ListaSolicitacoes
                demands={demands}
                ao_abrir_solicitacao={ao_abrir_solicitacao}
                ao_iniciar_cadastro={() => ao_navegar('new')}
              />
            </>
          ) : (
            <section className="staff-management">
              <header className="staff-queue-heading">
                <div>
                  <span className="eyebrow">ADMINISTRAÇÃO DE ACESSOS</span>
                  <h1>Central do gestor</h1>
                  <p>Cadastre novos servidores com o cargo inicial de Atendente.</p>
                </div>
              </header>
              <form className="panel staff-registration-form" onSubmit={enviar_cadastro_servidor}>
                <label>
                  Matrícula
                  <input
                    name="matricula"
                    type="number"
                    min="1"
                    step="1"
                    required
                    disabled={cadastro_em_andamento}
                    placeholder="Ex.: 1801591"
                  />
                </label>
                <label>
                  Nome completo
                  <input
                    name="nome"
                    type="text"
                    maxLength="150"
                    required
                    disabled={cadastro_em_andamento}
                    placeholder="Nome do servidor"
                  />
                </label>
                <label>
                  Senha inicial
                  <input
                    name="senha_recebida"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={cadastro_em_andamento}
                    placeholder="Defina uma senha inicial"
                  />
                </label>
                {erro_cadastro && (
                  <p className="access-error" role="alert">
                    {erro_cadastro}
                  </p>
                )}
                {mensagem_cadastro && (
                  <p className="staff-registration-success" role="status">
                    {mensagem_cadastro}
                  </p>
                )}
                <button className="button-primary" type="submit" disabled={cadastro_em_andamento}>
                  {cadastro_em_andamento ? 'Cadastrando…' : 'Cadastrar atendente'}
                </button>
              </form>
              {servidor?.role === 'Admin' && (
                <section className="staff-promotion-section">
                  <header className="staff-queue-heading">
                    <div>
                      <span className="eyebrow">PERMISSÕES DE ACESSO</span>
                      <h2>Promover servidor a Gestor</h2>
                      <p>
                        Informe a matrícula de um Atendente. Após a promoção, ele deverá entrar
                        novamente para receber o novo cargo.
                      </p>
                    </div>
                  </header>
                  <form className="panel staff-registration-form" onSubmit={enviar_promocao_gestor}>
                    <label>
                      Matrícula do Atendente
                      <input
                        name="matricula_gestor"
                        type="number"
                        min="1"
                        step="1"
                        required
                        disabled={promocao_em_andamento}
                        placeholder="Ex.: 1801591"
                      />
                    </label>
                    {erro_promocao && (
                      <p className="access-error" role="alert">
                        {erro_promocao}
                      </p>
                    )}
                    {mensagem_promocao && (
                      <p className="staff-registration-success" role="status">
                        {mensagem_promocao}
                      </p>
                    )}
                    <button
                      className="button-primary"
                      type="submit"
                      disabled={promocao_em_andamento}
                    >
                      {promocao_em_andamento ? 'Promovendo…' : 'Promover a Gestor'}
                    </button>
                  </form>
                </section>
              )}
              <section className="staff-server-list-section">
                <header className="staff-queue-heading">
                  <div>
                    <span className="eyebrow">EQUIPE MUNICIPAL</span>
                    <h2>Servidores cadastrados</h2>
                    <p>Lista de servidores e seus cargos atuais.</p>
                  </div>
                  <button
                    className="staff-home-link"
                    type="button"
                    onClick={carregar_servidores}
                    disabled={servidores_carregando}
                  >
                    {servidores_carregando ? 'Atualizando…' : 'Atualizar lista'}
                  </button>
                </header>
                {erro_lista_servidores && (
                  <p className="access-error" role="alert">
                    Não foi possível carregar os servidores: {erro_lista_servidores}
                  </p>
                )}
                {servidores_carregando ? (
                  <p className="staff-server-list-message">Carregando servidores…</p>
                ) : !erro_lista_servidores && servidores.length === 0 ? (
                  <p className="staff-server-list-message">Nenhum servidor cadastrado.</p>
                ) : (
                  <div className="panel staff-server-list">
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Matrícula</th>
                          <th scope="col">Nome</th>
                          <th scope="col">Cargo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {servidores.map((item) => (
                          <tr key={item.pk_matricula_servidor}>
                            <td>{item.pk_matricula_servidor}</td>
                            <td>{item.nome}</td>
                            <td>{item.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
