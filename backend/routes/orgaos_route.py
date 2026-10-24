from flask import Blueprint
from controllers.orgao_controller import listar_orgaos_controller

orgaos_routes = Blueprint("orgaos", __name__)


@orgaos_routes.route('/orgao/todos', methods=['GET'])
def Listar_Orgaos():
    return listar_orgaos_controller()
