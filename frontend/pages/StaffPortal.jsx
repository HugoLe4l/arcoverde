import { DemandsList } from '../components/DemandsList.jsx';
import './AccessPortal.css';

export function StaffPortal({ demands, onNavigate, onOpenDemand }) {
  const active = demands.filter((demand) => demand.status !== 'Concluída');
  const overdue = active.filter((demand) => demand.dueDate && demand.dueDate < new Date().toISOString().slice(0, 10));
  const urgent = active.filter((demand) => demand.urgency === 'Alta');

  return <div className="staff-portal page-container">
    <header className="staff-portal-heading">
      <div><span className="eyebrow">ÁREA DE GESTÃO MUNICIPAL</span><h1>Portal do servidor<span className="heading-dot">.</span></h1><p>Organize a fila, distribua responsabilidades e acompanhe cada atendimento.</p></div>
      <span className="staff-demo-badge"><i /> AMBIENTE DE DEMONSTRAÇÃO</span>
    </header>
    <section className="staff-overview" aria-label="Resumo da fila de atendimento">
      <article><span>Solicitações em aberto</span><b>{active.length}</b><small>aguardando conclusão</small></article>
      <article><span>Alta urgência</span><b>{urgent.length}</b><small>prioridade de análise</small></article>
      <article><span>Prazo vencido</span><b>{overdue.length}</b><small>precisam de acompanhamento</small></article>
      <article><span>Concluídas</span><b>{demands.length - active.length}</b><small>atendimentos finalizados</small></article>
    </section>
    <div className="staff-queue-heading"><div><span className="eyebrow">CENTRAL DE ATENDIMENTO</span><h2>Gerenciar solicitações</h2><p>Abra um registro para encaminhar à equipe, ajustar o prazo ou atualizar a situação.</p></div><button className="staff-home-link" onClick={() => onNavigate('home')}>← Voltar ao painel</button></div>
    <DemandsList demands={demands} onOpenDemand={onOpenDemand} onAdd={() => onNavigate('new')} />
    <p className="staff-demo-notice">Este portal é um protótipo acadêmico. Os registros e alterações são fictícios e ficam salvos somente neste navegador.</p>
  </div>;
}
