from flask import jsonify
from services.categoria_service import listar_categorias_service


def listar_categorias_controller():
    resultado = listar_categorias_service()

    if not resultado['success']:
        return jsonify(resultado), 500

    return jsonify({
        'success': True,
        'data': resultado['data']
    }), 200
