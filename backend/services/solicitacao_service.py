from models.solicitacao_modal import (
    listar_solicitacoes,
    listar_solicitacoes_por_cidadao,
    buscar_solicitacao_pelo_id,
    buscar_solicitacao_pelo_Protocolo,
    atualizar_solicitacao_com_historico
)
from models.servidor_model import buscar_servidor_por_matricula
from utils.criptografia import criptografar, Compare
from utils.jwt import gerar_token
import traceback

def listar_solicitacoes_service():
    try:
        resultado = listar_solicitacoes()
        return resultado

    except Exception as erro:
        traceback.print_exc()

        return {
            'success': False,
            'message': f'Houve um erro ao listar solicitacões: {erro}'
        }

def listar_solicitacoes_por_cidadao_service(ID_CIDADAO):
    try:
        return listar_solicitacoes_por_cidadao(ID_CIDADAO)
    except Exception as erro:
        traceback.print_exc()
        return {
            'success': False,
            'message': f'Houve um erro ao listar as solicitações do cidadão: {erro}'
        }


def buscar_solicitacao_pelo_id_service(ID_SOLICITACAO):
    try:
        resultado = buscar_solicitacao_pelo_id(ID_SOLICITACAO)
        return resultado

    except Exception as erro:
        traceback.print_exc()

        return {
            'success': False,
            'message': f'Houve um erro ao buscar solicitacão pelo id: {erro}'
        }

def buscar_solicitacao_pelo_Protocolo_service(PROTOCOLO):
    try:
        resultado = buscar_solicitacao_pelo_Protocolo(PROTOCOLO)
        return resultado

    except Exception as erro:
        traceback.print_exc()

        return {
            'success': False,
            'message': f'Houve um erro ao buscar solicitacão pelo protocolo: {erro}'
        }

def update_solicitacao_service(
    MATRICULA_SERVIDOR,
    ID_SOLICITACAO,
    NOVA_SITUACAO,
    OBSERVACAO,
    NIVEL_URGENCIA=None,
    ID_ORGAO=None
):
    try:
        return atualizar_solicitacao_com_historico(
            MATRICULA_SERVIDOR,
            ID_SOLICITACAO,
            NOVA_SITUACAO,
            OBSERVACAO,
            NIVEL_URGENCIA,
            ID_ORGAO
        )

    except Exception as erro:
                return {
                                'success': False, 
                                'message': f"Houve um error ao realizar o login: {erro}"
                            }
