import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header.jsx';
import { Home } from '../pages/Home.jsx';
import { DemandsList } from '../components/DemandsList.jsx';
import { DemandForm } from '../components/DemandForm.jsx';
import { DemandDetails } from '../components/DemandDetails.jsx';
import { Footer } from '../components/Footer.jsx';
import { AccessPortal } from '../pages/AccessPortal.jsx';
import { StaffPortal } from '../pages/StaffPortal.jsx';
import { api, mapDemand, statusToApi, urgencyToApi } from './api.js';

const SESSION_KEY = 'arcoverde-conecta-session-v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [demands, setDemands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null; } catch { return null; }
  });
  const [selectedId, setSelectedId] = useState(null);
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  async function refreshDemands() {
    const data = await api.demands();
    const rows = data.resultado || data.data || [];
    setDemands(rows.map((row) => mapDemand(row, categories)));
    setApiError('');
  }

  useEffect(() => {
    let alive = true;
    Promise.all([api.categories(), api.demands()]).then(([categoryData, demandData]) => {
      if (!alive) return;
      setCategories(categoryData.data || []);
      setDemands((demandData.resultado || demandData.data || []).map((row) => mapDemand(row, categoryData.data || [])));
      setApiError('');
    }).catch((error) => { if (alive) setApiError(error.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const metrics = useMemo(() => {
    const active = demands.filter((d) => d.status !== 'Concluída');
    return { total: demands.length, active: active.length, urgent: active.filter((d) => d.urgency === 'Alta').length, overdue: 0, done: demands.length - active.length };
  }, [demands]);

  function authenticated(value) {
    setSession(value);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(value)); } catch { /* The session remains active for this tab. */ }
    setActiveTab(value.role === 'server' ? 'serverPortal' : 'new');
  }

  async function createDemand(fields) {
    if (!session || session.role !== 'citizen') { setActiveTab('access'); return; }
    const category = categories.find((item) => item.nome === fields.category) || categories[0];
    if (!category) { setApiError('A API não retornou categorias para registrar a solicitação.'); return; }
    try {
      await api.createDemand({ titulo: fields.title, categoria_id: category.pk_id_categoria, bairro: fields.neighborhood, rua: fields.address, descricao: fields.description }, session.token);
      await refreshDemands();
      setActiveTab('demands');
    } catch (error) { setApiError(error.message); }
  }

  async function updateDemand(id, changes, note) {
    if (!session || session.role !== 'server') { setApiError('Entre com uma conta de servidor para atualizar solicitações.'); return; }
    const demand = demands.find((item) => item.id === id);
    if (!demand) return;
    const body = { id_solicitacao: demand.apiId, nova_situacao: statusToApi(changes.status || demand.status), observacao: note || '' };
    if (changes.urgency) body.nivel_urgencia = urgencyToApi(changes.urgency);
    if (changes.orgId) body.orgao_id = changes.orgId;
    try { await api.updateDemand(body, session.token); await refreshDemands(); }
    catch (error) { setApiError(error.message); }
  }

  const selectedDemand = demands.find((d) => d.id === selectedId);
  return <div className="app-shell">
    <Header activeTab={activeTab} setActiveTab={setActiveTab} />
    {apiError && <div className="page-container" role="alert"><p className="access-error">Não foi possível concluir a operação: {apiError} <button type="button" onClick={() => { setApiError(''); refreshDemands().catch((error) => setApiError(error.message)); }}>Tentar novamente</button></p></div>}
    <main className="main-content">
      {activeTab === 'home' && <Home demands={demands} metrics={metrics} onOpenDemand={setSelectedId} onNavigate={setActiveTab} />}
      {activeTab === 'demands' && <DemandsList demands={demands} onOpenDemand={setSelectedId} onAdd={() => setActiveTab(session?.role === 'citizen' ? 'new' : 'access')} />}
      {activeTab === 'new' && (session?.role === 'citizen' ? <DemandForm categories={categories} onAddDemand={createDemand} onCancel={() => setActiveTab('home')} /> : <AccessPortal onAuthenticated={authenticated} />)}
      {activeTab === 'access' && <AccessPortal onAuthenticated={authenticated} />}
      {activeTab === 'serverPortal' && session?.role === 'server' && <StaffPortal demands={demands} server={session?.profile} onNavigate={setActiveTab} onOpenDemand={setSelectedId} />}
      {loading && <div className="page-container"><p>Conectando ao Arcoverde Conecta…</p></div>}
      {!loading && !apiError && demands.length === 0 && activeTab === 'home' && <div className="page-container"><p>A API está conectada. Ainda não há solicitações cadastradas.</p></div>}
    </main>
    <Footer />
    {selectedDemand && <DemandDetails demand={selectedDemand} categories={categories} onClose={() => setSelectedId(null)} onUpdate={updateDemand} isServer={session?.role === 'server'} />}
  </div>;
}