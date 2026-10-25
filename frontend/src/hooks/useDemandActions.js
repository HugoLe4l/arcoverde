import { useState } from 'react';
import {
  criar_solicitacao as enviar_solicitacao,
  atualizar_solicitacao as enviar_atualizacao,
} from '../services/api.js';
import { situacao_para_api, urgencia_para_api } from '../utils/demandMappers.js';

export function useAcoesSolicitacao({
  session,
  categories,
  demands,
  atualizar_solicitacoes,
  definir_aba_ativa,
}) {
  const [error, setError] = useState('');

  async function criar_solicitacao(fields) {
    setError('');
    if (session?.role !== 'citizen') {
      definir_aba_ativa('access');
      return;
    }

    const category = categories.find((item) => item.nome === fields.category);
    if (!category) {
      setError('A categoria selecionada não está disponível na API.');
      return;
    }

    const solicitacao = {
      titulo: fields.title,
      categoria_id: category.pk_id_categoria,
      bairro: fields.neighborhood,
      cep: fields.cep,
      rua: fields.address,
      descricao: fields.description,
    };
    if (fields.latitude !== undefined && fields.longitude !== undefined) {
      solicitacao.latitude = fields.latitude;
      solicitacao.longitude = fields.longitude;
    }

    try {
      await enviar_solicitacao(solicitacao, session.token);
    } catch (requestError) {
      setError(requestError.message);
      return;
    }

    definir_aba_ativa('myDemands');

    try {
      await atualizar_solicitacoes();
    } catch (requestError) {
      setError(
        `Solicitação criada, mas não foi possível atualizar a lista geral: ${requestError.message}`,
      );
    }
  }

  async function atualizar_solicitacao(id, changes, note) {
    setError('');
    if (session?.role !== 'server') {
      setError('Entre com uma conta de servidor para atualizar solicitações.');
      return;
    }

    const demand = demands.find((item) => item.id === id);
    if (!demand) {
      setError('A solicitação não está disponível na lista atual.');
      return;
    }

    const body = {
      id_solicitacao: demand.apiId,
      nova_situacao: situacao_para_api(changes.status || demand.status),
      observacao: note || '',
    };
    if (changes.urgency) body.nivel_urgencia = urgencia_para_api(changes.urgency);
    if (changes.orgId) body.orgao_id = changes.orgId;

    try {
      await enviar_atualizacao(body, session.token);
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }

    try {
      await atualizar_solicitacoes();
    } catch (requestError) {
      setError(
        `Atualização salva, mas não foi possível atualizar a lista: ${requestError.message}`,
      );
    }

    return true;
  }

  return {
    criar_solicitacao,
    atualizar_solicitacao,
    error,
    limpar_erro: () => setError(''),
  };
}
