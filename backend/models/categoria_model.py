from config.database import conectar
from psycopg import Error
from utils.enums import TabelasBancoDeDados


def listar_categorias():
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(f"""
            SELECT
                c.pk_id_categoria,
                c.nome,
                COALESCE(
                    jsonb_agg(
                        jsonb_build_object(
                            'id', o.pk_id_orgao,
                            'nome', o.nome
                        )
                        ORDER BY o.nome
                    ) FILTER (WHERE o.pk_id_orgao IS NOT NULL),
                    '[]'::jsonb
                ) AS orgaos
            FROM {TabelasBancoDeDados.CATEGORIAS.value} c
            LEFT JOIN {TabelasBancoDeDados.ORGAOS_CATEGORIAS.value} oc
                ON oc.fk_id_categoria = c.pk_id_categoria
            LEFT JOIN {TabelasBancoDeDados.ORGAOS.value} o
                ON o.pk_id_orgao = oc.fk_id_orgao
            GROUP BY c.pk_id_categoria, c.nome
            ORDER BY c.nome
        """)
        return {
            'success': True,
            'data': cursor.fetchall()
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao listar as categorias: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()
