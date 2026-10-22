import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header.jsx';
import { Home } from '../pages/Home.jsx';
import { DemandsList } from '../components/DemandsList.jsx';
import { DemandForm } from '../components/DemandForm.jsx';
import { DemandDetails } from '../components/DemandDetails.jsx';
import { Footer } from '../components/Footer.jsx';
import { AccessPortal } from '../pages/AccessPortal.jsx';
import { StaffPortal } from '../pages/StaffPortal.jsx';

const STORAGE_KEY = 'arcoverde-conecta-demands-v2';
const now = Date.now();
const isoDay = (days = 0) => new Date(now + days * 86400000).toISOString().slice(0, 10);
const activity = (days, text, by) => ({ date: new Date(now - days * 86400000).toISOString(), text, by });
const sampleDemands = [
  { id: 'ARC-2026-0001', title: 'Buraco em frente à escola municipal', category: 'Infraestrutura', neighborhood: 'São Cristóvão', address: 'Rua Antônio Gomes, próximo à Escola José de Siqueira', description: 'Um buraco ocupa parte da faixa de rolamento e dificulta a passagem de veículos e pedestres.', urgency: 'Alta', reach: 'Afeta uma rua', status: 'Em andamento', sector: 'Obras e Serviços Públicos', responsible: 'Equipe de manutenção', dueDate: isoDay(-1), createdAt: activity(4, '', '').date, photo: '', history: [activity(4, 'Demanda registrada pela equipe de atendimento.', 'Central de atendimento'), activity(3, 'Encaminhada para Obras e Serviços Públicos.', 'Mariana Costa'), activity(1, 'Equipe de campo realizou vistoria no local.', 'Equipe de manutenção')] },
  { id: 'ARC-2026-0002', title: 'Lâmpada apagada na Praça da Bandeira', category: 'Iluminação', neighborhood: 'Centro', address: 'Praça da Bandeira, próximo ao coreto', description: 'O poste central permanece apagado à noite, deixando a área com pouca iluminação.', urgency: 'Média', reach: 'Ponto isolado', status: 'Pendente', sector: 'Iluminação Pública', responsible: 'A definir', dueDate: isoDay(2), createdAt: activity(1, '', '').date, photo: '', history: [activity(1, 'Demanda registrada e aguardando distribuição.', 'Central de atendimento')] },
  { id: 'ARC-2026-0003', title: 'Resíduos acumulados no ponto de coleta', category: 'Limpeza urbana', neighborhood: 'São Geraldo', address: 'Avenida Pinto de Campos, 460', description: 'Resíduos aguardam recolhimento desde a última rota, próximo a residências e comércios.', urgency: 'Alta', reach: 'Afeta um quarteirão', status: 'Pendente', sector: 'Limpeza Urbana', responsible: 'A definir', dueDate: isoDay(0), createdAt: activity(0, '', '').date, photo: '', history: [activity(0, 'Demanda registrada pela equipe de atendimento.', 'Central de atendimento')] },
  { id: 'ARC-2026-0004', title: 'Vazamento na calçada', category: 'Saneamento', neighborhood: 'Boa Vista', address: 'Rua José de Oliveira Calado, 52', description: 'Água escorre pela calçada e forma um acúmulo próximo às casas.', urgency: 'Alta', reach: 'Afeta um quarteirão', status: 'Aguardando equipe', sector: 'Saneamento', responsible: 'Equipe de campo 02', dueDate: isoDay(1), createdAt: activity(2, '', '').date, photo: '', history: [activity(2, 'Demanda registrada.', 'Central de atendimento'), activity(1, 'Solicitação encaminhada para a equipe de saneamento.', 'Mariana Costa')] },
  { id: 'ARC-2026-0005', title: 'Poda de árvore em área pública', category: 'Meio ambiente', neighborhood: 'Boa Esperança', address: 'Rua da Liberdade, 90', description: 'Galhos avançam sobre a calçada perto da unidade de saúde.', urgency: 'Baixa', reach: 'Ponto isolado', status: 'Concluída', sector: 'Meio Ambiente', responsible: 'Equipe de arborização', dueDate: isoDay(-2), createdAt: activity(5, '', '').date, photo: '', history: [activity(5, 'Demanda registrada.', 'Central de atendimento'), activity(1, 'Poda concluída e calçada liberada para circulação.', 'Equipe de arborização')] },
];

function loadDemands() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) return stored.map((d) => ({ ...d, neighborhood: d.neighborhood || 'Centro', address: d.address || d.location || '', urgency: d.urgency || d.priority || 'Média', reach: d.reach || 'Ponto isolado', sector: d.sector || 'A definir', responsible: d.responsible || 'A definir', dueDate: d.dueDate || '', createdAt: d.createdAt || new Date().toISOString(), history: d.history || [] }));
  } catch { /* Use the fictional demo records if local storage is unavailable. */ }
  return sampleDemands;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [demands, setDemands] = useState(loadDemands);
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(demands)); } catch { /* Demo stays usable for this session. */ } }, [demands]);

  const metrics = useMemo(() => {
    const active = demands.filter((d) => d.status !== 'Concluída');
    return {
      total: demands.length,
      active: active.length,
      urgent: active.filter((d) => d.urgency === 'Alta').length,
      overdue: active.filter((d) => d.dueDate && d.dueDate < isoDay()).length,
      done: demands.filter((d) => d.status === 'Concluída').length,
    };
  }, [demands]);

  function createDemand(fields) {
    setDemands((current) => {
      const nextNumber = Math.max(0, ...current.map((d) => Number(String(d.id).match(/\d+$/)?.[0]) || 0)) + 1;
      const demand = {
        ...fields,
        id: `ARC-${new Date().getFullYear()}-${String(nextNumber).padStart(4, '0')}`,
        status: 'Pendente', sector: 'A definir', responsible: 'A definir', dueDate: '',
        createdAt: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), text: 'Demanda registrada na base de demonstração.', by: 'Central de atendimento' }],
      };
      return [demand, ...current];
    });
    setActiveTab('demands');
  }

  function updateDemand(id, changes, note) {
    setDemands((current) => current.map((d) => {
      if (d.id !== id) return d;
      const history = [...(d.history || [])];
      if (note) history.push({ date: new Date().toISOString(), text: note, by: 'Equipe municipal' });
      return { ...d, ...changes, history };
    }));
  }

  const selectedDemand = demands.find((d) => d.id === selectedId);
  return (
    <div className="app-shell">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {activeTab === 'home' && <Home demands={demands} metrics={metrics} onOpenDemand={setSelectedId} onNavigate={setActiveTab} />}
        {activeTab === 'demands' && <DemandsList demands={demands} onOpenDemand={setSelectedId} onAdd={() => setActiveTab('new')} />}
        {activeTab === 'new' && <DemandForm onAddDemand={createDemand} onCancel={() => setActiveTab('home')} />}
        {activeTab === 'access' && <AccessPortal onNavigate={setActiveTab} onServerLogin={() => setActiveTab('serverPortal')} />}
        {activeTab === 'serverPortal' && <StaffPortal demands={demands} onNavigate={setActiveTab} onOpenDemand={setSelectedId} />}
      </main>
      <Footer />
      {selectedDemand && <DemandDetails demand={selectedDemand} onClose={() => setSelectedId(null)} onUpdate={updateDemand} />}
    </div>
  );
}
