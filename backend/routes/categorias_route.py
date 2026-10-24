from flask import Blueprint
from controllers.categoria_controller import listar_categorias_controller

categorias_routes = Blueprint("categorias", __name__)


@categorias_routes.route('/categoria/todos', methods=['GET'])
def Listar_Categorias():
    return listar_categorias_controller()
