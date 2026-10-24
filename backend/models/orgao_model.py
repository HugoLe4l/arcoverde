from config.database import conectar
from psycopg import Error
from utils.enums import TabelasBancoDeDados


def listar_orgaos():
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(f"""
            SELECT
                o.pk_id_orgao,
                o.nome,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', c.pk_id_categoria,
                            'nome', c.nome
                        )
                        ORDER BY c.nome
                    ) FILTER (WHERE c.pk_id_categoria IS NOT NULL),
                    '[]'::jsonb
                ) AS categorias
            FROM {TabelasBancoDeDados.ORGAOS.value} o
            LEFT JOIN {TabelasBancoDeDados.ORGAOS_CATEGORIAS.value} oc
                ON oc.fk_id_orgao = o.pk_id_orgao
            LEFT JOIN {TabelasBancoDeDados.CATEGORIAS.value} c
                ON c.pk_id_categoria = oc.fk_id_categoria
            GROUP BY o.pk_id_orgao, o.nome
            ORDER BY o.nome
        """)
        return {
            'success': True,
            'data': cursor.fetchall()
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao listar os órgãos: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()
