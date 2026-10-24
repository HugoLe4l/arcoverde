from flask import Blueprint
from controllers.cidadao_controller import register_controller, login_controller, criar_solicitacao_controller
from utils.jwt import validar_token

cidadoes_routes = Blueprint("cidadoes", __name__)

@cidadoes_routes.route('/cidadao/register', methods=['POST'])
def Register():
    return register_controller()

@cidadoes_routes.route('/cidadao/login', methods=['POST'])
def Login():
    return login_controller()

@cidadoes_routes.route('/cidadao/criar-solicitacao', methods=['POST'])
@validar_token('cidadao')
def Criar_Solicitacao():
    return criar_solicitacao_controller()
