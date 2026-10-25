from config.database import conectar
from psycopg import Error
from utils.gerar_protocolos import gerar_protocolo
from utils.enums import TabelasBancoDeDados


def listar_solicitacoes():
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
                        'success': False, 
                        'message': f"Houve um error ao realizar a Query: {erro}"
                }
        
    try:
        sql = f"SELECT * FROM {TabelasBancoDeDados.SOLICITACOES.value}"
        cursor.execute(sql, ())

        resultado = cursor.fetchall()

        return {
            'success': True, 
            'message': f"Lista de solicitações encontrada.",
            'resultado': resultado
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

def listar_solicitacoes_por_cidadao(ID_CIDADAO):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(
            f"""
                SELECT *
                FROM {TabelasBancoDeDados.SOLICITACOES.value}
                WHERE fk_id_cidadao = %s
                ORDER BY data_criacao DESC
            """,
            (ID_CIDADAO,)
        )
        resultado = cursor.fetchall()

        return {
            'success': True,
            'message': 'Solicitações do cidadão encontradas.',
            'resultado': resultado
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao listar as solicitações do cidadão: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()

def buscar_solicitacao_pelo_id(ID_SOLICITACAO):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
                        'success': False, 
                        'message': f"Houve um error ao realizar a Query: {erro}"
                }
        
    try:
        sql = f"""
                    SELECT
                        to_jsonb(s) AS solicitacao,
                        COALESCE(
                            (
                                SELECT jsonb_agg(to_jsonb(h) ORDER BY h.data_atualizacao ASC)
                                FROM {TabelasBancoDeDados.HISTORICO_SOLICITACAO.value} AS h
                                WHERE h.fk_id_solicitacao = s.pk_id_solicitacao
                            ),
                            '[]'::jsonb
                        ) AS historico
                    FROM {TabelasBancoDeDados.SOLICITACOES.value} AS s
                    WHERE s.pk_id_solicitacao = %s
                """
        cursor.execute(sql, (ID_SOLICITACAO, ))

        resultado = cursor.fetchone()

        return {
            'success': resultado is not None, 
            'message': f"Solicitação encontrada." if resultado is not None else "Solicitação não encontrada.",
            'resultado': resultado
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

def buscar_solicitacao_pelo_Protocolo(PROTOCOLO):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
                        'success': False, 
                        'message': f"Houve um error ao realizar a Query: {erro}"
                }
        
    try:
        sql = f"SELECT * FROM {TabelasBancoDeDados.SOLICITACOES.value} WHERE protocolo = %s"
        cursor.execute(sql, (PROTOCOLO, ))

        resultado = cursor.fetchone()

        return {
            'success': resultado is not None, 
            'message': f"Protocolo encontrada." if resultado is not None else "Protocolo não encontrado.",
            'resultado': resultado
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

def atualizar_solicitacao_com_historico(
    MATRICULA_SERVIDOR,
    ID_SOLICITACAO,
    NOVA_SITUACAO,
    OBSERVACAO,
    NIVEL_URGENCIA=None,
    ID_ORGAO=None
):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(
            f"""
                SELECT fk_id_categoria
                FROM {TabelasBancoDeDados.SOLICITACOES.value}
                WHERE pk_id_solicitacao = %s
                FOR UPDATE
            """,
            (ID_SOLICITACAO,)
        )
        solicitacao_existente = cursor.fetchone()

        if solicitacao_existente is None:
            conexao.rollback()
            return {
                'success': False,
                'message': 'Solicitação não encontrada.'
            }

        if ID_ORGAO is not None:
            cursor.execute(
                f"""
                    SELECT 1
                    FROM {TabelasBancoDeDados.ORGAOS_CATEGORIAS.value}
                    WHERE fk_id_orgao = %s AND fk_id_categoria = %s
                """,
                (ID_ORGAO, solicitacao_existente['fk_id_categoria'])
            )
            if cursor.fetchone() is None:
                conexao.rollback()
                return {
                    'success': False,
                    'message': 'O órgão informado não está associado à categoria da solicitação.'
                }

        cursor.execute(
            f"""
                UPDATE {TabelasBancoDeDados.SOLICITACOES.value}
                SET situacao = %s,
                    nivel_urgencia = COALESCE(%s, nivel_urgencia),
                    fk_id_orgao = COALESCE(%s, fk_id_orgao)
                WHERE pk_id_solicitacao = %s
                RETURNING *
            """,
            (
                NOVA_SITUACAO,
                NIVEL_URGENCIA,
                ID_ORGAO,
                ID_SOLICITACAO
            )
        )
        resultado = cursor.fetchone()

        cursor.execute(
            f"""
                INSERT INTO {TabelasBancoDeDados.HISTORICO_SOLICITACAO.value}
                    (
                        fk_matricula_servidor,
                        fk_id_solicitacao,
                        situacao_nova,
                        nivel_urgencia_nova,
                        fk_id_orgao,
                        observacao
                    )
                VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                MATRICULA_SERVIDOR,
                ID_SOLICITACAO,
                NOVA_SITUACAO,
                resultado['nivel_urgencia'],
                resultado['fk_id_orgao'],
                OBSERVACAO
            )
        )

        conexao.commit()

        return {
            'success': True,
            'message': 'Solicitação atualizada e histórico registrado com sucesso.',
            'resultado': resultado
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao atualizar a solicitação e registrar o histórico: {erro}'
        }

    finally:
        cursor.close()
        conexao.close()
