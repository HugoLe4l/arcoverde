import psycopg
from psycopg import Error
from psycopg.rows import dict_row
from psycopg import sql

#Conexao cria uma instancia com o banco   
#Cursor serve para executar os comandos sql
#Fetchone pega uma unica linha do resultado

DB_HOST = "localhost"
DB_PORT = 5432
DB_USER = "postgres"
DB_PASS = "123"
DB_NAME = "ArcoverdeConecta"

def criarDB():
    try:
        # Conecta ao banco padrão do PostgreSQL
        conexao = psycopg.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            dbname="postgres",
            autocommit=True
        )

        try:
            cursor = conexao.cursor()

            # Verifica se o banco já existe
            cursor.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                (DB_NAME,)
            )

            if cursor.fetchone():
                print(f"\n🟢 Banco '{DB_NAME}' já existe.\n")
                return True

            # Cria o banco
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(DB_NAME)
                )
            )

            print(f"\n🟢 Banco '{DB_NAME}' criado com sucesso.\n")
            return True

        finally:
            conexao.close()

    except Error as erro:
        print(f"\n🔴 Erro ao criar o banco: {erro}\n")
        return False




    
def conectar():
    try:
        conexao = psycopg.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            dbname=DB_NAME,
            row_factory=dict_row
        )

        print(
            f"\n🟢 Conexão com o banco "
            f"'{DB_NAME}' estabelecida.\n"
        )

        cursor = conexao.cursor()

        return conexao, cursor

    except Error as erro:
        print(f"\n🔴 Erro ao conectar ao banco: {erro}\n")
        return False, False
        

