from models.servidor_model import (
    cadastrar_servidor,
    buscar_servidor_por_matricula,
    buscar_dados_servidor,
    listar_servidores,
    promover_servidor_a_gestor
)
from utils.jwt import gerar_token
from utils.criptografia import criptografar, Compare
import traceback

def cadastrar_servidor_service(MATRICULA, NOME, SENHA_RECEBIDA):
    try:
        procura_matricula = buscar_servidor_por_matricula(MATRICULA)
        if procura_matricula['success']:
            return{
                'success': False,
                'message': 'MATRICULA já registrado.'
            }
        
        #Transforma a senha em hash
        SENHA_HASH = criptografar(SENHA_RECEBIDA)
        if not SENHA_HASH['success']:
            return SENHA_HASH
        
        operacao = cadastrar_servidor(
            MATRICULA,
            NOME,
            'Atendente',
            SENHA_HASH['senha_hash']
        )
        return operacao 
                
    except Exception as erro:
        traceback.print_exc()  # Mostra o erro completo no terminal

        return {
                    'success': False, 
                    'message': f"Houve um error ao realizar o cadastro do servidor: {erro}"
                }

def login_servidor_service(MATRICULA, SENHA_RECEBIDA):
    try:
        if not MATRICULA or not SENHA_RECEBIDA:
             return{
                        'success': False,
                        'message': 'Há obrigatórios campos vazios.'
                    }
        
        #Verifica se o CPF já está no banco
        procura_matricula = buscar_servidor_por_matricula(MATRICULA)
        if not procura_matricula['success']:
             return{
                        'success': False,
                        'message': 'MATRICULA ou senha inválidos!'
                    }
        
        SENHA_HASH_DA_MATRICULA = procura_matricula['data']['senha_hash']
        ID_USER_DA_MATRICULA = procura_matricula['data']['pk_matricula_servidor']
        USERNAME_DA_MATRICULA = procura_matricula['data']['nome']
        ROLE_DA_MATRICULA = procura_matricula['data']['role']

        #Verifica se a senha enviada é igual a o hash no banco
        check_senha = Compare(SENHA_RECEBIDA, SENHA_HASH_DA_MATRICULA)
        if not check_senha:
             return{
                        'success': False,
                        'message': 'Matrícula ou senha inválidos!'
                    }
        token = gerar_token(
            ID_USER_DA_MATRICULA,
            USERNAME_DA_MATRICULA,
            'servidor',
            ROLE_DA_MATRICULA
        )
        return{
                        'success': True,
                        'message': 'Login do Servidor realizado com sucesso.',
                        'token': token
                    }

        

    except Exception as erro:
                return {
                                'success': False, 
                                'message': f"Houve um error ao realizar o login: {erro}"
                            }

def buscar_dados_servidor_service(MATRICULA):
    return buscar_dados_servidor(MATRICULA)

def listar_servidores_service():
    return listar_servidores()

def promover_gestor_service(MATRICULA):
    return promover_servidor_a_gestor(MATRICULA)
