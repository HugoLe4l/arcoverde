import jwt
import datetime
from functools import wraps
from flask import request, jsonify
from flask import g

KEY_SECRET = "YUH78KloPTA7#f98"

def gerar_token(ID_USER, USERNAME, TIPO_USUARIO, ROLE=None):
    payload = {
        'ID_USER': ID_USER,
        'USERNAME': USERNAME,
        'TIPO_USUARIO': TIPO_USUARIO,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=2)
    }
    if ROLE:
        payload['ROLE'] = ROLE

    token = jwt.encode(payload, KEY_SECRET, algorithm="HS256")
    return token

def validar_token(tipo_usuario=None, roles=None):
    def decorator(function):
        @wraps(function)
        def decorated(*args, **kwargs):
            resultado, status = verifica_token()
            if status != 200:
                return jsonify(resultado), status

            if tipo_usuario and request.user.get('TIPO_USUARIO') != tipo_usuario:
                return jsonify({
                    'success': False,
                    'message': 'Este usuário não tem permissão para realizar esta ação.'
                }), 403

            if roles is not None and request.user.get('ROLE') not in roles:
                return jsonify({
                    'success': False,
                    'message': 'Este usuário não tem permissão para realizar esta ação.'
                }), 403

            return function(*args, **kwargs)
        return decorated
    return decorator


def verifica_token():
        try:
            token = request.headers.get("Authorization")
            
            if not token:
                return {
                        'success': False,
                        'message': 'Token não enviado'
                }, 401
            
            token = token.replace("Bearer ", "")

            payload = jwt.decode(token, KEY_SECRET, algorithms=["HS256"])
            request.user = payload

            return {
                    'success': True,
                    'message': 'Token valido'
                }, 200
        
        except jwt.ExpiredSignatureError:
            return {
                    'success': False,
                    'message': 'Token Expirado'
                }, 401
        
        except jwt.InvalidTokenError:
            return {
                    'success': False,
                    'message': 'Token inválido'
                }, 401