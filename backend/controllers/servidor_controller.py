from flask import request, jsonify
from services.servidor_service import (
    cadastrar_servidor_service,
    login_servidor_service,
    buscar_dados_servidor_service,
    listar_servidores_service,
    promover_gestor_service
)


def cadastrar_controller():
   try:
       data = request.json

       if not data:
            return jsonify({
                    'success': False,
                    'message': 'Data vazio'
                    }), 400
       
       MATRICULA = data.get("matricula")
       NOME = data.get("nome")
       SENHA_RECEBIDA = data.get("senha_recebida")

       if not MATRICULA or not NOME or not SENHA_RECEBIDA:
           return jsonify({
                    'success': False,
                    'message': 'Há campos obrigatórios vazios.'
                    }), 400
       
       operacao = cadastrar_servidor_service(MATRICULA, NOME, SENHA_RECEBIDA)
       if not operacao['success']:
            return jsonify(operacao), 409
       
       return jsonify(operacao), 201
   

   except Exception as error:
        print(f"Erro durante o registro: {error}")
        return jsonify({
                    'success': False,
                    'message': 'Houve um error durante o cadastro do servidor.'
                    }), 500

def login_controller():
    try:
       data = request.json

       if not data:
            return jsonify({
                    'success': False,
                    'message': 'Data vazio'
                    }), 400
       
       MATRICULA = data.get("matricula")
       SENHA_RECEBIDA = data.get("senha")

       if not MATRICULA or not SENHA_RECEBIDA:
           return jsonify({
                    'success': False,
                    'message': 'Há campos obrigatórios vazios.'
                    }), 400
       
       operacao = login_servidor_service( MATRICULA, SENHA_RECEBIDA)

       if not operacao['success']:
            return jsonify(operacao), 401
       
       return jsonify(operacao), 200
    
    except Exception as error:
            print(f"Erro durante o login: {error}")
            return jsonify({
                        'success': False,
                        'message': 'Houve um error durante o login.'
                        }), 500

def dados_servidor_controller():
    resultado = buscar_dados_servidor_service(request.user["ID_USER"])

    if not resultado['success']:
        return jsonify(resultado), 500

    if resultado['data'] is None:
        return jsonify({
            'success': False,
            'message': 'Servidor não encontrado.'
        }), 404

    return jsonify({
        'success': True,
        'data': resultado['data']
    }), 200

def dados_servidor_por_matricula_controller(MATRICULA):
    resultado = buscar_dados_servidor_service(MATRICULA)

    if not resultado['success']:
        return jsonify(resultado), 500

    if resultado['data'] is None:
        return jsonify({
            'success': False,
            'message': 'Servidor não encontrado.'
        }), 404

    return jsonify({
        'success': True,
        'data': resultado['data']
    }), 200

def listar_servidores_controller():
    resultado = listar_servidores_service()

    if not resultado['success']:
        return jsonify(resultado), 500

    return jsonify({
        'success': True,
        'data': resultado['data']
    }), 200

def promover_gestor_controller():
    data = request.json
    if not data:
        return jsonify({
            'success': False,
            'message': 'Data vazio'
        }), 400

    matricula = data.get('matricula')
    if not isinstance(matricula, int) or isinstance(matricula, bool):
        return jsonify({
            'success': False,
            'message': 'O campo matricula deve ser um número inteiro.'
        }), 400

    resultado = promover_gestor_service(matricula)
    if not resultado['success']:
        status = 404 if resultado.get('not_found') else 409
        return jsonify(resultado), status

    return jsonify(resultado), 200
