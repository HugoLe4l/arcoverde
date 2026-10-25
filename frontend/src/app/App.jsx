import { useEffect, useMemo, useState } from 'react';
import { DetalhesSolicitacao } from '../components/DemandDetails.jsx';
import { FormularioSolicitacao } from '../components/DemandForm.jsx';
import { ListaSolicitacoes } from '../components/DemandsList.jsx';
import { Rodape } from '../components/Footer.jsx';
import { Cabecalho } from '../components/Header.jsx';
import { useAcoesSolicitacao } from '../hooks/useDemandActions.js';
import { useDadosPublicos } from '../hooks/usePublicData.js';
import { useSessao } from '../hooks/useSession.js';
import { PortalAcesso } from '../pages/AccessPortal.jsx';
import { PaginaInicial } from '../pages/Home.jsx';
import { PortalServidor } from '../pages/StaffPortal.jsx';

export default function Aplicacao() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedId, setSelectedId] = useState(null);
  const {
    session,
    loading: sessionLoading,
    error: sessionError,
    autenticar,
    encerrar_sessao,
  } = useSessao();
  const {
    categories,
    demands,
    loading: dataLoading,
    error: dataError,
    atualizar_solicitacoes,
    myDemands,
    myDemandsLoading,
    myDemandsError,
    carregar_minhas_solicitacoes,
  } = useDadosPublicos();
  const {
    criar_solicitacao,
    atualizar_solicitacao,
    error: actionError,
  } = useAcoesSolicitacao({
    session,
    categories,
    demands,
    atualizar_solicitacoes,
    definir_aba_ativa: navegar_para_aba,
  });

  const metrics = useMemo(() => {
    const active = demands.filter((demand) => demand.status !== 'Concluída');
    return {
      total: demands.length,
      active: active.length,
      urgent: active.filter((demand) => demand.urgency === 'Alta').length,
      overdue: 0,
      done: demands.length - active.length,
    };
  }, [demands]);

  const selectedDemand =
    demands.find((demand) => demand.id === selectedId) ||
    myDemands.find((demand) => demand.id === selectedId);
  const error = actionError || sessionError || dataError;

  useEffect(() => {
    if (selectedId) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedId]);

  function autenticar_usuario(value) {
    autenticar(value);
    setActiveTab(value.role === 'server' ? 'serverPortal' : 'new');
  }

  function sair_usuario() {
    encerrar_sessao();
    setSelectedId(null);
    setActiveTab('home');
  }

  function navegar_para_aba(aba) {
    setSelectedId(null);
    setActiveTab(aba);
    if (aba === 'myDemands' && session?.role === 'citizen') {
      carregar_minhas_solicitacoes(session.token);
    }
  }

  return (
    <div className="app-shell">
      <Cabecalho
        aba_ativa={activeTab}
        definir_aba_ativa={navegar_para_aba}
        nome_usuario={session?.profile?.nome}
        usuario_logado={Boolean(session)}
        tipo_usuario={session?.role}
        cargo_usuario={session?.profile?.role}
        ao_sair={sair_usuario}
      />
      {error && (
        <div className="page-container" role="alert">
          <p className="access-error">Não foi possível concluir a operação: {error}</p>
        </div>
      )}
      <main className="main-content">
        {sessionLoading ? (
          <div className="page-container">
            <p>Validando sessão salva…</p>
          </div>
        ) : selectedDemand ? (
          <DetalhesSolicitacao
            demand={selectedDemand}
            categories={categories}
            ao_fechar={() => setSelectedId(null)}
            ao_atualizar_solicitacao={atualizar_solicitacao}
            isServer={session?.role === 'server'}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <PaginaInicial
                demands={demands}
                metrics={metrics}
                ao_abrir_solicitacao={setSelectedId}
                ao_navegar={setActiveTab}
              />
            )}
            {activeTab === 'demands' && (
              <ListaSolicitacoes
                demands={demands}
                ao_abrir_solicitacao={setSelectedId}
                ao_iniciar_cadastro={() =>
                  setActiveTab(session?.role === 'citizen' ? 'new' : 'access')
                }
              />
            )}
            {activeTab === 'myDemands' &&
              session?.role === 'citizen' &&
              (myDemandsLoading ? (
                <div className="page-container">
                  <p>Carregando suas demandas…</p>
                </div>
              ) : myDemandsError ? (
                <div className="page-container" role="alert">
                  <p className="access-error">
                    Não foi possível carregar suas demandas: {myDemandsError}
                  </p>
                </div>
              ) : (
                <ListaSolicitacoes
                  demands={myDemands}
                  minhas_demandas
                  ao_abrir_solicitacao={setSelectedId}
                  ao_iniciar_cadastro={() => setActiveTab('new')}
                />
              ))}
            {activeTab === 'new' &&
              (session?.role === 'citizen' ? (
                <FormularioSolicitacao
                  categories={categories}
                  ao_criar_solicitacao={criar_solicitacao}
                  ao_cancelar={() => setActiveTab('home')}
                />
              ) : (
                <PortalAcesso ao_autenticar={autenticar_usuario} />
              ))}
            {activeTab === 'access' && <PortalAcesso ao_autenticar={autenticar_usuario} />}
            {activeTab === 'serverPortal' && session?.role === 'server' && (
              <PortalServidor
                demands={demands}
                servidor={session.profile}
                token={session.token}
                ao_navegar={setActiveTab}
                ao_abrir_solicitacao={setSelectedId}
              />
            )}
            {dataLoading && (
              <div className="page-container">
                <p>Conectando ao Arcoverde Conecta…</p>
              </div>
            )}
            {!dataLoading && !dataError && demands.length === 0 && activeTab === 'home' && (
              <div className="page-container">
                <p>A API está conectada. Ainda não há solicitações cadastradas.</p>
              </div>
            )}
          </>
        )}
      </main>
      <Rodape />
    </div>
  );
}
