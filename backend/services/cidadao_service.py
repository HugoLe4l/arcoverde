from models.cidadao_model import create_new_cidadao, search_cidadao_for_email, search_cidadao_for_cpf, create_solicitacao
from utils.criptografia import criptografar, Compare
from utils.jwt import gerar_token
import traceback

def create_cidadao_service(NOME, CPF, EMAIL, SENHA_RECEBIDA):
    try:
        #Verifica se o cpf e email já está no banco
        procura_cpf = search_cidadao_for_cpf(CPF)
        if procura_cpf['success']:
            return{
                'success': False,
                'message': 'Cpf já registrado.'
            }

        procura_email = search_cidadao_for_email(EMAIL)
        if procura_email['success']:
            return{
                'success': False,
                'message': 'Email já registrado.'
            }
        
        #Transforma a senha em hash
        SENHA_HASH = criptografar(SENHA_RECEBIDA)
        if not SENHA_HASH['success']:
            return SENHA_HASH
        
        create_user = create_new_cidadao(NOME, CPF, EMAIL, SENHA_HASH['senha_hash'])
        return create_user 
                
    except Exception as erro:
        traceback.print_exc()  # Mostra o erro completo no terminal

        return {
                    'success': False, 
                    'message': f"Houve um error ao realizar o cadastro: {erro}"
                }


def login_cidadao_service(CPF, SENHA_RECEBIDA):
    try:
        if not CPF or not SENHA_RECEBIDA:
             return{
                        'success': False,
                        'message': 'Há campos vazios.'
                    }
        
        #Verifica se o CPF já está no banco
        procura_cpf = search_cidadao_for_cpf(CPF)
        if not procura_cpf['success']:
             return{
                        'success': False,
                        'message': 'CPF ou senha inválidos!'
                    }
        SENHA_HASH_DO_CPF = procura_cpf['data']['senha_hash']
        ID_USER_DO_CPF = procura_cpf['data']['pk_id_cidadao']
        USERNAME_DO_CPF = procura_cpf['data']['nome']

        #Verifica se a senha enviada é igual a o hash no banco
        check_senha = Compare(SENHA_RECEBIDA, SENHA_HASH_DO_CPF)
        if not check_senha:
             return{
                        'success': False,
                        'message': 'Email ou senha inválidos!'
                    }
        token = gerar_token(ID_USER_DO_CPF, USERNAME_DO_CPF, 'cidadao')
        return{
                        'success': True,
                        'message': 'Login realizado com sucesso.',
                        'token': token
                    }

        

    except Exception as erro:
                return {
                                'success': False, 
                                'message': f"Houve um error ao realizar o login: {erro}"
                            }


def create_solicitacao_service(
    ID_SOLICITANTE,
    TITULO,
    ID_CATEGORIA,
    BAIRRO,
    RUA,
    DESCRICAO,
    LATITUDE=None,
    LONGITUDE=None
):
    try:
        # Cria a solicitação
        resultado = create_solicitacao(
            ID_SOLICITANTE,
            TITULO,
            ID_CATEGORIA,
            BAIRRO,
            RUA,
            DESCRICAO,
            LATITUDE,
            LONGITUDE
        )

        return resultado

    except Exception as erro:
        traceback.print_exc()

        return {
            'success': False,
            'message': f'Houve um erro ao criar a solicitação: {erro}'
        }
