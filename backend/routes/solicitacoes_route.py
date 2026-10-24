from flask import Blueprint
from controllers.solicitacao_controller import listar_solicitacoes_controller, buscar_solicitacao_pelo_id_controller, buscar_solicitacao_pelo_Protocolo_controller, update_solicitacao_controller
from utils.jwt import validar_token

solicitacoes_routes = Blueprint("solicitacoes", __name__)

@solicitacoes_routes.route('/solicitacao/listar-solicitacoes', methods=['GET'])
def Listar_Solicitacoes():
    return listar_solicitacoes_controller()

@solicitacoes_routes.route('/solicitacao/<int:id_solicitacao>', methods=['GET'])
def Buscar_Pelo_ID(id_solicitacao):
    return buscar_solicitacao_pelo_id_controller(id_solicitacao)

@solicitacoes_routes.route('/solicitacao/<string:protocolo>', methods=['GET'])
def Buscar_Pelo_PROTOCOLO(protocolo):
    return buscar_solicitacao_pelo_Protocolo_controller(protocolo)


@solicitacoes_routes.route('/solicitacao/update', methods=['POST'])
@validar_token('servidor')
def Update_Solicitacao():
    return update_solicitacao_controller()
