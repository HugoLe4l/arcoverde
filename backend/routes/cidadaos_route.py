from flask import Blueprint
from controllers.cidadao_controller import (
    register_controller,
    login_controller,
    dados_cidadao_controller,
    criar_solicitacao_controller
)
from controllers.solicitacao_controller import listar_minhas_solicitacoes_controller
from utils.jwt import validar_token

cidadoes_routes = Blueprint("cidadoes", __name__)

@cidadoes_routes.route('/cidadao/register', methods=['POST'])
def Register():
    return register_controller()

@cidadoes_routes.route('/cidadao/login', methods=['POST'])
def Login():
    return login_controller()

@cidadoes_routes.route('/cidadao/me', methods=['GET'])
@validar_token('cidadao')
def Dados_Cidadao():
    return dados_cidadao_controller()

@cidadoes_routes.route('/cidadao/criar-solicitacao', methods=['POST'])
@validar_token('cidadao')
def Criar_Solicitacao():
    return criar_solicitacao_controller()

@cidadoes_routes.route('/cidadao/minhas-solicitacoes', methods=['GET'])
@validar_token('cidadao')
def Minhas_Solicitacoes():
    return listar_minhas_solicitacoes_controller()
