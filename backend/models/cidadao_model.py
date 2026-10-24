from config.database import conectar
from psycopg import Error
from utils.gerar_protocolos import gerar_protocolo
from utils.enums import TabelasBancoDeDados

def create_new_cidadao(NOME, CPF, EMAIL, SENHA_HASH):
    conexao, cursor = conectar()
    if conexao and cursor:
        try:
            sql = f"INSERT INTO {TabelasBancoDeDados.CIDADAOS.value} (NOME, CPF, EMAIL, SENHA_HASH) VALUES (%s, %s, %s, %s) RETURNING pk_id_cidadao"
            cursor.execute(sql, (NOME, CPF, EMAIL, SENHA_HASH))
            id_cidadao = cursor.fetchone()['pk_id_cidadao']
            
            conexao.commit()

            print(f"User criado com sucesso. ID: {id_cidadao}")
            return {
                'success': True, 
                'message': f"Usuário criado com sucesso."
            }
        except Error as erro:
            conexao.rollback()
            return {
                'success': False, 
                'message': f"Houve um error ao realizar a Query: {erro}"
            }
        
        finally:
            cursor.close()
            conexao.close()

def search_cidadao_for_email(EMAIL):
    conexao, cursor = conectar()

    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    
    try:
        sql = f"SELECT * FROM {TabelasBancoDeDados.CIDADAOS.value} WHERE email = %s"
        cursor.execute(sql, (EMAIL, ))

        usuario = cursor.fetchone()

        return {
            'success': usuario is not None,
            'message': f"Usuário encontrado com sucesso." if usuario else f"Usuário não encontrado.",
            'data': usuario                
        }
            
    except Error as erro:
        return {
            'success': False,
            'message': f"Houve um error ao realizar a Query: {erro}",              
        }
        
    finally:
            cursor.close()
            conexao.close()

def search_cidadao_for_cpf(CPF):
    conexao, cursor = conectar()

    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }
    
    try:
        sql = f"SELECT * FROM {TabelasBancoDeDados.CIDADAOS.value} WHERE CPF = %s"
        cursor.execute(sql, (CPF, ))

        usuario = cursor.fetchone()

        return {
            'success': usuario is not None,
            'message': f"Usuário encontrado com sucesso." if usuario else f"Usuário não encontrado.",
            'data': usuario                
        }
            
    except Error as erro:
        return {
            'success': False,
            'message': f"Houve um error ao realizar a Query: {erro}",              
        }
        
    finally:
        cursor.close()
        conexao.close()

def create_solicitacao(
    ID_SOLICITANTE,
    TITULO,
    ID_CATEGORIA,
    BAIRRO,
    RUA,
    DESCRICAO,
    LATITUDE=None,
    LONGITUDE=None
):
    conexao, cursor = conectar()

    if conexao and cursor:
        try:
            protocolo = gerar_protocolo()

            sql = f"""
                INSERT INTO {TabelasBancoDeDados.SOLICITACOES.value}
                (
                    protocolo,
                    fk_id_cidadao,
                    fk_id_categoria,
                    titulo,
                    categoria,
                    bairro,
                    rua,
                    latitude,
                    longitude,
                    descricao
                )
                SELECT %s, %s, pk_id_categoria, %s, nome, %s, %s, %s, %s, %s
                FROM {TabelasBancoDeDados.CATEGORIAS.value}
                WHERE pk_id_categoria = %s
                RETURNING pk_id_solicitacao
            """

            cursor.execute(sql, (
                protocolo,
                ID_SOLICITANTE,
                TITULO,
                BAIRRO,
                RUA,
                LATITUDE,
                LONGITUDE,
                DESCRICAO,
                ID_CATEGORIA,
            ))

            if cursor.fetchone() is None:
                conexao.rollback()
                return {
                    'success': False,
                    'message': 'A categoria informada não existe.'
                }

            conexao.commit()

            return {
                'success': True,
                'message': 'Solicitação criada com sucesso.',
            }

        except Error as erro:
            conexao.rollback()

            return {
                'success': False,
                'message': f'Houve um erro ao realizar a Query: {erro}'
            }

        finally:
            cursor.close()
            conexao.close()

    return {
        'success': False,
        'message': 'Não foi possível conectar ao banco de dados.'
    }
