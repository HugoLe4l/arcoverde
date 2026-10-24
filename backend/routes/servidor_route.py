from flask import Blueprint
from controllers.servidor_controller import (
    cadastrar_controller,
    login_controller,
    dados_servidor_controller,
    dados_servidor_por_matricula_controller,
    listar_servidores_controller,
    promover_gestor_controller
)
from utils.jwt import validar_token

servidor_routes = Blueprint("servidores", __name__)

@servidor_routes.route('/servidor/cadastrar', methods=['POST'])
@validar_token('servidor', roles=['Admin', 'Gestor'])
def Cadastrar():
    return cadastrar_controller()

@servidor_routes.route('/servidor/login', methods=['POST'])
def Login():
    return login_controller()

@servidor_routes.route('/servidor/me', methods=['GET'])
@validar_token('servidor')
def Dados_Servidor():
    return dados_servidor_controller()

@servidor_routes.route('/servidor/matricula/<int:matricula>', methods=['GET'])
@validar_token('servidor')
def Dados_Servidor_Por_Matricula(matricula):
    return dados_servidor_por_matricula_controller(matricula)

@servidor_routes.route('/servidor/todos', methods=['GET'])
@validar_token('servidor')
def Todos_Servidores():
    return listar_servidores_controller()

@servidor_routes.route('/servidor/promover-gestor', methods=['POST'])
@validar_token('servidor', roles=['Admin'])
def Promover_Gestor():
    return promover_gestor_controller()
