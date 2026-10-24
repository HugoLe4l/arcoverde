import math
from flask import request, jsonify
from services.cidadao_service import create_cidadao_service, login_cidadao_service, create_solicitacao_service

def register_controller():
   try:
       data = request.json

       if not data:
            return jsonify({
                    'success': False,
                    'message': 'Data vazio'
                    }), 400
       
       nome = data.get("nome")
       cpf = data.get("cpf")
       email = data.get("email")
       senha = data.get("senha")

       if not nome or not cpf or not email or not senha:
           return jsonify({
                    'success': False,
                    'message': 'Há campos obrigatórios vazios.'
                    }), 400
       
       operacao = create_cidadao_service(nome, cpf, email, senha)
       if not operacao['success']:
            return jsonify(operacao), 409
       
       return jsonify(operacao), 201
   

   except Exception as error:
        print(f"Erro durante o registro: {error}")
        return jsonify({
                    'success': False,
                    'message': 'Houve um error durante o registro.'
                    }), 500

def login_controller():
    try:
       data = request.json

       if not data:
            return jsonify({
                    'success': False,
                    'message': 'Data vazio'
                    }), 400
       
       cpf = data.get("cpf")
       senha = data.get("senha")

       if not cpf or not senha:
           return jsonify({
                    'success': False,
                    'message': 'Há campos vazios'
                    }), 400
       
       operacao = login_cidadao_service( cpf, senha)

       if not operacao['success']:
            return jsonify(operacao), 401
       
       return jsonify(operacao), 200
    
    except Exception as error:
            print(f"Erro durante o login: {error}")
            return jsonify({
                        'success': False,
                        'message': 'Houve um error durante o login.'
                        }), 500

def criar_solicitacao_controller():
     try:
          data = request.json
     
          if not data:
               return jsonify({
                         'success': False,
                         'message': 'Data vazio'
                         }), 400 

          ID_SOLICITANTE = request.user["ID_USER"]
          TITULO = data.get("titulo")
          ID_CATEGORIA = data.get("categoria_id")
          BAIRRO = data.get("bairro")
          RUA = data.get("rua")
          DESCRICAO = data.get("descricao")
          LATITUDE = data.get("latitude")
          LONGITUDE = data.get("longitude")

          if not all([ID_SOLICITANTE, TITULO, ID_CATEGORIA, BAIRRO, RUA, DESCRICAO]):
                    return jsonify({
                         'success': False,
                         'message': 'Há campos vazios.'
                    }), 400

          if not isinstance(ID_CATEGORIA, int) or isinstance(ID_CATEGORIA, bool):
                    return jsonify({
                         'success': False,
                         'message': 'O campo categoria_id deve ser um número inteiro.'
                    }), 400

          if (LATITUDE is None) != (LONGITUDE is None):
                    return jsonify({
                         'success': False,
                         'message': 'Latitude e longitude devem ser informadas juntas.'
                    }), 400

          if LATITUDE is not None:
                    coordenadas_numericas = all(
                         isinstance(coordenada, (int, float))
                         and not isinstance(coordenada, bool)
                         and math.isfinite(coordenada)
                         for coordenada in (LATITUDE, LONGITUDE)
                    )
                    if (
                         not coordenadas_numericas
                         or not -90 <= LATITUDE <= 90
                         or not -180 <= LONGITUDE <= 180
                    ):
                         return jsonify({
                              'success': False,
                              'message': 'Coordenadas inválidas. Latitude deve estar entre -90 e 90 e longitude entre -180 e 180.'
                         }), 400

          operacao = create_solicitacao_service(
               ID_SOLICITANTE,
               TITULO,
               ID_CATEGORIA,
               BAIRRO,
               RUA,
               DESCRICAO,
               LATITUDE,
               LONGITUDE
          )

          if not operacao['success']:
               return jsonify(operacao), 400

          return jsonify(operacao), 201

     except Exception as error:
                 print(f"Erro durante o login: {error}")
                 return jsonify({
                             'success': False,
                             'message': 'Houve um error durante a criação da solicitação.'
                             }), 500