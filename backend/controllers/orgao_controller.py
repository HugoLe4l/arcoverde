from flask import jsonify
from services.orgao_service import listar_orgaos_service


def listar_orgaos_controller():
    resultado = listar_orgaos_service()

    if not resultado['success']:
        return jsonify(resultado), 500

    return jsonify({
        'success': True,
        'data': resultado['data']
    }), 200
