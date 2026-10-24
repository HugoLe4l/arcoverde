import { DemandsList } from '../components/DemandsList.jsx';
import './AccessPortal.css';

export function StaffPortal({ demands, onNavigate, onOpenDemand, server }) {
  const active = demands.filter((demand) => demand.status !== 'Concluída');
  const urgent = active.filter((demand) => demand.urgency === 'Alta');
  return <div className="staff-portal page-container">
    <header className="staff-portal-heading"><div><span className="eyebrow">ÁREA DE GESTÃO MUNICIPAL</span><h1>Portal do servidor<span className="heading-dot">.</span></h1><p>{server?.nome ? `Olá, ${server.nome}. ` : ''}Gerencie as solicitações registradas na base municipal.</p></div></header>
    <section className="staff-overview" aria-label="Resumo da fila de atendimento"><article><span>Solicitações em aberto</span><b>{active.length}</b><small>aguardando conclusão</small></article><article><span>Alta urgência</span><b>{urgent.length}</b><small>prioridade de análise</small></article><article><span>Órgãos responsáveis</span><b>{new Set(demands.map((d) => d.sector).filter((x) => x && x !== 'A definir')).size}</b><small>com encaminhamentos</small></article><article><span>Concluídas</span><b>{demands.length - active.length}</b><small>atendimentos finalizados</small></article></section>
    <div className="staff-queue-heading"><div><span className="eyebrow">CENTRAL DE ATENDIMENTO</span><h2>Gerenciar solicitações</h2><p>Atualize situação, urgência, órgão responsável e registre providências no histórico.</p></div><button className="staff-home-link" onClick={() => onNavigate('home')}>← Voltar ao painel</button></div>
    <DemandsList demands={demands} onOpenDemand={onOpenDemand} onAdd={() => onNavigate('new')} />
  </div>;
}
