from flask import request, jsonify
from services.solicitacao_service import (
    listar_solicitacoes_service,
    listar_solicitacoes_por_cidadao_service,
    buscar_solicitacao_pelo_id_service,
    buscar_solicitacao_pelo_Protocolo_service,
    update_solicitacao_service,
)

def listar_solicitacoes_controller():
     try:

          operacao = listar_solicitacoes_service()

          if not operacao['success']:
               return jsonify(operacao), 400

          return jsonify(operacao), 201

     except Exception as error:
                 print(f"Erro durante a consulta: {error}")
                 return jsonify({
                             'success': False,
                             'message': 'Houve um error durante a consulta de solicitações.'
                             }), 500

def listar_minhas_solicitacoes_controller():
     try:
          ID_CIDADAO = request.user.get('ID_USER')
          if not isinstance(ID_CIDADAO, int) or isinstance(ID_CIDADAO, bool):
               return jsonify({
                                'success': False,
                                'message': 'O token não contém um ID de cidadão válido.'
               }), 401

          operacao = listar_solicitacoes_por_cidadao_service(ID_CIDADAO)
          if not operacao['success']:
               return jsonify(operacao), 500

          return jsonify(operacao), 200
     except Exception as error:
          print(f"Erro durante a consulta das solicitações do cidadão: {error}")
          return jsonify({
               'success': False,
               'message': 'Houve um erro ao consultar suas solicitações.'
          }), 500

def buscar_solicitacao_pelo_id_controller(ID_SOLICITACAO):
     try:

          operacao = buscar_solicitacao_pelo_id_service(ID_SOLICITACAO)

          if not operacao['success']:
               return jsonify(operacao), 400

          return jsonify(operacao), 201

     except Exception as error:
                 print(f"Erro durante a consulta: {error}")
                 return jsonify({
                             'success': False,
                             'message': 'Houve um error durante a consulta da solicitação.'
                             }), 500
     
def buscar_solicitacao_pelo_Protocolo_controller(PROTOCOLO):
     try:

          operacao = buscar_solicitacao_pelo_Protocolo_service(PROTOCOLO)

          if not operacao['success']:
               return jsonify(operacao), 400

          return jsonify(operacao), 201

     except Exception as error:
                 print(f"Erro durante a consulta: {error}")
                 return jsonify({
                             'success': False,
                             'message': 'Houve um error durante a consulta da solicitação.'
                             }), 500

def update_solicitacao_controller():
        data = request.json
        if not data:
            return jsonify({
                    'success': False,
                    'message': 'Data vazio'
                    }), 400 
        MATRICULA_SERVIDOR = request.user["ID_USER"]
        ID_SOLICITACAO = data.get("id_solicitacao")
        NOVA_SITUACAO = data.get("nova_situacao")
        NIVEL_URGENCIA = data.get("nivel_urgencia")
        ID_ORGAO = data.get("orgao_id")
        OBSERVACAO = data.get("observacao", data.get("obeservacao"))

        if not ID_SOLICITACAO or not NOVA_SITUACAO:
           return jsonify({
                    'success': False,
                    'message': 'Há campos vazios'
                    }), 400 

        if NIVEL_URGENCIA is not None and NIVEL_URGENCIA not in ('Baixo', 'Medio', 'Alto'):
           return jsonify({
                    'success': False,
                    'message': 'Nível de urgência inválido. Use Baixo, Medio ou Alto.'
                    }), 400

        if ID_ORGAO is not None and (
            not isinstance(ID_ORGAO, int) or isinstance(ID_ORGAO, bool)
        ):
           return jsonify({
                    'success': False,
                    'message': 'O campo orgao_id deve ser um número inteiro.'
                    }), 400
        
        operacao = update_solicitacao_service(
            MATRICULA_SERVIDOR,
            ID_SOLICITACAO,
            NOVA_SITUACAO,
            OBSERVACAO,
            NIVEL_URGENCIA,
            ID_ORGAO
        )
        if not operacao['success']:
                return jsonify(operacao), 403
        
        return jsonify(operacao), 200 