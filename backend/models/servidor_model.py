from config.database import conectar
from psycopg import Error
from utils.enums import TabelasBancoDeDados


def cadastrar_servidor(MATRICULA, NOME, ROLE, SENHA_HASH):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
                        'success': False, 
                        'message': f"Houve um error ao realizar a Query"
                }
        
    try:
        sql = f"INSERT INTO {TabelasBancoDeDados.SERVIDORES.value} (pk_matricula_servidor, nome, role, senha_hash) VALUES (%s, %s, %s, %s) RETURNING pk_matricula_servidor"
        cursor.execute(sql, (MATRICULA, NOME, ROLE, SENHA_HASH))
        pk_matricula_servidor = cursor.fetchone()['pk_matricula_servidor']
        conexao.commit()

        print(f"Servidor cadastrado com sucesso. MATRICULA: {pk_matricula_servidor}")

        return {
            'success': True, 
            'message': f"Servidor cadastrado com sucesso. MATRICULA: {pk_matricula_servidor}"
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
     
def buscar_servidor_por_matricula(MATRICULA):
    conexao, cursor = conectar()
    if not conexao or not cursor:
            return {
                            'success': False, 
                            'message': f"Houve um error ao realizar a Query"
                    }  
    
    try:
        sql = f"SELECT * FROM {TabelasBancoDeDados.SERVIDORES.value} WHERE pk_matricula_servidor = %s"
        cursor.execute(sql, (MATRICULA, ))

        resultado = cursor.fetchone()

        return {
                    'success': resultado is not None,
                    'message': f"Servidor encontrado com sucesso." if resultado else f"Servidor não encontrado.",
                    'data': resultado                
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

def buscar_dados_servidor(MATRICULA):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        sql = f"""
            SELECT pk_matricula_servidor, nome, role
            FROM {TabelasBancoDeDados.SERVIDORES.value}
            WHERE pk_matricula_servidor = %s
        """
        cursor.execute(sql, (MATRICULA,))
        servidor = cursor.fetchone()

        return {
            'success': True,
            'data': servidor
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao buscar os dados do servidor: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()

def listar_servidores():
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(f"""
            SELECT pk_matricula_servidor, nome, role
            FROM {TabelasBancoDeDados.SERVIDORES.value}
            ORDER BY nome
        """)
        return {
            'success': True,
            'data': cursor.fetchall()
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao listar os servidores: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()

def promover_servidor_a_gestor(MATRICULA):
    conexao, cursor = conectar()
    if not conexao or not cursor:
        return {
            'success': False,
            'message': 'Não foi possível conectar ao banco de dados.'
        }

    try:
        cursor.execute(
            f"""
                UPDATE {TabelasBancoDeDados.SERVIDORES.value}
                SET role = 'Gestor'
                WHERE pk_matricula_servidor = %s AND role = 'Atendente'
                RETURNING pk_matricula_servidor, nome, role
            """,
            (MATRICULA,)
        )
        servidor = cursor.fetchone()

        if servidor is None:
            cursor.execute(
                f"""
                    SELECT pk_matricula_servidor, nome, role
                    FROM {TabelasBancoDeDados.SERVIDORES.value}
                    WHERE pk_matricula_servidor = %s
                """,
                (MATRICULA,)
            )
            servidor = cursor.fetchone()
            conexao.rollback()
            if servidor is not None and servidor['role'] == 'Gestor':
                return {
                    'success': True,
                    'message': 'O servidor já é Gestor.',
                    'data': servidor
                }
            if servidor is not None:
                return {
                    'success': False,
                    'message': 'Somente um Atendente pode ser promovido a Gestor.'
                }
            return {
                'success': False,
                'not_found': True,
                'message': 'Servidor não encontrado.'
            }

        conexao.commit()
        return {
            'success': True,
            'message': 'Servidor promovido a Gestor com sucesso.',
            'data': servidor
        }
    except Error as erro:
        conexao.rollback()
        return {
            'success': False,
            'message': f'Houve um erro ao promover o servidor: {erro}'
        }
    finally:
        cursor.close()
        conexao.close()
    
       