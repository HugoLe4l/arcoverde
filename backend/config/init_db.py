from config.database import conectar
from psycopg import Error
from utils.enums import TabelasBancoDeDados
from utils.criptografia import criptografar

def init_db():
 
    conexao, cursor = conectar()
    if not conexao or not cursor:
        print("Erro: não foi possível conectar ao banco.")
        return False



    
     # CRIAÇÃO DO ENUM ROLE_SERVIDOR
    try:
        cursor.execute("""
                DO $$
                BEGIN
                    CREATE TYPE role_servidor AS ENUM (
                        'Admin',
                        'Atendente',
                        'Gestor'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN NULL;
                END
                $$;
            """)
        print("✅ ENUM role_servidor OK")

    except Exception as e:
        conexao.rollback()
        print(f"❌ Erro ao criar ENUM: {e}")
        return False


    # CRIAÇÃO DO ENUM SITUACAO_SOLICITACAO
    try:
        cursor.execute("""
                DO $$
                BEGIN
                    CREATE TYPE situacao_solicitacao AS ENUM (
                        'Aberta',
                        'Em andamento',
                        'Concluido'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN NULL;
                END
                $$;
            """)
        print("✅ ENUM situacao_solicitacao OK")

    except Exception as e:
        conexao.rollback()
        print(f"❌ Erro ao criar ENUM: {e}")
        return False

    # CRIAÇÃO DO ENUM NIVEL_URGENCIA
    try:
        cursor.execute("""
                DO $$
                BEGIN
                    CREATE TYPE nivel_urgencia AS ENUM (
                        'Baixo',
                        'Medio',
                        'Alto'
                    );
                EXCEPTION
                    WHEN duplicate_object THEN NULL;
                END
                $$;
            """)
        print("✅ ENUM nivel_urgencia OK")

    except Exception as e:
        conexao.rollback()
        print(f"❌ Erro ao criar ENUM de urgência: {e}")
        return False




    

    # CRIAÇÃO DA TABELA Cidadão
    try:
        try:
            cursor.execute(f"""CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.CIDADAOS.value} (
                                         pk_id_cidadao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                         nome VARCHAR(255) NOT NULL,
                                         cpf VARCHAR(11) NOT NULL UNIQUE,
                                        email VARCHAR(255) NOT NULL UNIQUE,
                                        senha_hash VARCHAR(255) NOT NULL,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                                    );""")  
            print(f"✅ Tabela {TabelasBancoDeDados.CIDADAOS.value} OK") 

        except Error as erro:
                conexao.rollback()
                print(f"❌ Error ao tentar criar tabela {TabelasBancoDeDados.CIDADAOS.value}: {erro}")
                return False


        
       # CRIAÇÃO DA TABELA Servidores
        try:
            cursor.execute(f"""CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.SERVIDORES.value} (
                                        pk_matricula_servidor INT PRIMARY KEY,
                                        nome VARCHAR(100) NOT NULL,
                                        role role_servidor NOT NULL DEFAULT 'Atendente',
                                        senha_hash VARCHAR(255) NOT NULL
                                        );""")
            print(f"✅ Tabela {TabelasBancoDeDados.SERVIDORES.value} OK") 

        except Error as erro:
                conexao.rollback()
                print(f"❌ Error ao tentar criar tabela {TabelasBancoDeDados.SERVIDORES.value}: {erro}")
                return False

        # CRIAÇÃO DAS TABELAS DE ÓRGÃOS E CATEGORIAS
        try:
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.ORGAOS.value} (
                    pk_id_orgao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    nome VARCHAR(150) NOT NULL UNIQUE
                )
            """)
            cursor.execute(
                f"""
                    INSERT INTO {TabelasBancoDeDados.ORGAOS.value} (nome)
                    VALUES
                        (%s),
                        (%s),
                        (%s),
                        (%s),
                        (%s)
                    ON CONFLICT (nome) DO NOTHING
                """,
                (
                    'Secretaria de Infraestrutura',
                    'Secretaria de Serviços Públicos',
                    'Compesa',
                    'Guarda Municipal',
                    'Secretaria de Proteção animal'
                )
            )



            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.CATEGORIAS.value} (
                    pk_id_categoria INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    nome VARCHAR(150) NOT NULL UNIQUE
                )
            """)
            cursor.execute(
                f"""
                    INSERT INTO {TabelasBancoDeDados.CATEGORIAS.value} (nome)
                    VALUES
                        (%s),
                        (%s),
                        (%s),
                        (%s),
                        (%s),
                        (%s),
                        (%s)
                    ON CONFLICT (nome) DO NOTHING
                """,
                (
                    'Infraestrutura urbana',
                    'Iluminação pública',
                    'Limpeza urbana',
                    'Saneamento básico',
                    'Abastecimento de água',
                    'Segurança pública',
                    'Proteção animal'
                )
            )


            
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.ORGAOS_CATEGORIAS.value} (
                    fk_id_orgao INT NOT NULL,
                    fk_id_categoria INT NOT NULL,
                    PRIMARY KEY (fk_id_orgao, fk_id_categoria),
                    FOREIGN KEY (fk_id_orgao)
                        REFERENCES {TabelasBancoDeDados.ORGAOS.value} (pk_id_orgao),
                    FOREIGN KEY (fk_id_categoria)
                        REFERENCES {TabelasBancoDeDados.CATEGORIAS.value} (pk_id_categoria)
                )
            """)
            cursor.execute(
                f"""
                    INSERT INTO {TabelasBancoDeDados.ORGAOS_CATEGORIAS.value}
                        (fk_id_orgao, fk_id_categoria)
                    SELECT o.pk_id_orgao, c.pk_id_categoria
                    FROM (VALUES
                        (%s, %s),
                        (%s, %s),
                        (%s, %s),
                        (%s, %s),
                        (%s, %s),
                        (%s, %s),
                        (%s, %s)
                    ) AS associacoes(nome_categoria, nome_orgao)
                    JOIN {TabelasBancoDeDados.CATEGORIAS.value} c
                        ON c.nome = associacoes.nome_categoria
                    JOIN {TabelasBancoDeDados.ORGAOS.value} o
                        ON o.nome = associacoes.nome_orgao
                    ON CONFLICT (fk_id_orgao, fk_id_categoria) DO NOTHING
                """,
                (
                    'Infraestrutura urbana', 'Secretaria de Infraestrutura',
                    'Saneamento básico', 'Secretaria de Infraestrutura',
                    'Iluminação pública', 'Secretaria de Serviços Públicos',
                    'Limpeza urbana', 'Secretaria de Serviços Públicos',
                    'Abastecimento de água', 'Compesa',
                    'Segurança pública', 'Guarda Municipal',
                    'Proteção animal', 'Secretaria de Proteção animal'
                )
            )
            print("✅ Tabelas de órgãos, categorias e associação OK")

        except Error as erro:
            conexao.rollback()
            print(f"❌ Erro ao criar tabelas de órgãos e categorias: {erro}")
            return False



        
        #CRIAÇÃO DA TABELA Solicitações
        try:
            cursor.execute(f"""CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.SOLICITACOES.value} (
                                        pk_id_solicitacao INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                        protocolo VARCHAR(30) NOT NULL UNIQUE,
                                        fk_id_cidadao INT NOT NULL,
                                        fk_id_categoria INT REFERENCES categorias (pk_id_categoria),
                                        fk_id_orgao INT REFERENCES orgaos (pk_id_orgao),
                                        titulo VARCHAR(255) NOT NULL,
                                        categoria VARCHAR(100) NOT NULL,
                                        bairro VARCHAR(100) NOT NULL,
                                        cep VARCHAR(8) NOT NULL,
                                        rua VARCHAR(150) NOT NULL,
                                        latitude DOUBLE PRECISION,
                                        longitude DOUBLE PRECISION,
                                        descricao TEXT NOT NULL,
                                        situacao situacao_solicitacao NOT NULL DEFAULT 'Aberta',
                                        nivel_urgencia nivel_urgencia NOT NULL DEFAULT 'Baixo',
                                        data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    
                                        FOREIGN KEY (fk_id_cidadao)
                                        REFERENCES cidadaos (pk_id_cidadao)
                                        );""")
                    
            print(f"✅ Tabela {TabelasBancoDeDados.SOLICITACOES.value} OK") 
        
        except Error as erro:
                conexao.rollback()
                print(f"❌ Error ao tentar criar tabela {TabelasBancoDeDados.SOLICITACOES.value}: {erro}")
                return False


        #CRIAÇÃO DA TABELA Histórico da Solicitação
        try:
            cursor.execute(f"""CREATE TABLE IF NOT EXISTS {TabelasBancoDeDados.HISTORICO_SOLICITACAO.value} (
                                        pk_id_historico INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                        fk_id_solicitacao INT NOT NULL,
                                        fk_matricula_servidor INT NOT NULL,
                                        situacao_nova VARCHAR(30) NOT NULL,
                                        nivel_urgencia_nova nivel_urgencia,
                                        fk_id_orgao INT REFERENCES orgaos (pk_id_orgao),
                                        observacao TEXT,
                                        data_atualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                        FOREIGN KEY (fk_id_solicitacao)
                                        REFERENCES solicitacoes (pk_id_solicitacao),

                                        FOREIGN KEY (fk_matricula_servidor)
                                        REFERENCES servidores (pk_matricula_servidor)
                                        );""")
                    
            print(f"✅ Tabela {TabelasBancoDeDados.HISTORICO_SOLICITACAO.value} OK") 
        
        except Error as erro:
                conexao.rollback()
                print(f"❌ Error ao tentar criar tabela {TabelasBancoDeDados.HISTORICO_SOLICITACAO.value}: {erro}")
                return False

        if not criar_admin_inicial(cursor):
            conexao.rollback()
            return False

        conexao.commit()
        print(f"✅ Todas as tabelas foram organizadas.\n")
        return True

    except Error as erro:
        conexao.rollback()
        print(f"❌ Error ao tentar criar tabela: {erro}")
        return False

    finally:
        cursor.close()
        conexao.close()


def criar_admin_inicial(cursor):
    cursor.execute(
        f"""
            SELECT pk_matricula_servidor
            FROM {TabelasBancoDeDados.SERVIDORES.value}
            WHERE role = 'Admin'
            LIMIT 1
        """
    )
    admin_existente = cursor.fetchone()

    if admin_existente is not None:
        print("✅ Um administrador já está cadastrado.")
        return True

    print("\n👮 Nenhum administrador foi encontrado. Vamos cadastrar o primeiro Admin.")
    try:
        while True:
            matricula = input("Matrícula do Admin: ").strip()
            if not matricula.isdigit() or int(matricula) <= 0:
                print("❌ A matrícula deve ser um número inteiro positivo.")
                continue
            matricula = int(matricula)

            cursor.execute(
                f"""
                    SELECT 1
                    FROM {TabelasBancoDeDados.SERVIDORES.value}
                    WHERE pk_matricula_servidor = %s
                """,
                (matricula,)
            )
            if cursor.fetchone() is not None:
                print("❌ Essa matrícula já está cadastrada. Informe outra.")
                continue
            break

        while True:
            nome = input("Nome do Admin: ").strip()
            if nome:
                break
            print("❌ O nome não pode ficar vazio.")

        while True:
            senha_admin = input("Senha do Admin: ")
            confirmacao_senha = input("Confirme a senha: ")
            if not senha_admin:
                print("❌ A senha não pode ficar vazia.")
                continue
            if senha_admin != confirmacao_senha:
                print("❌ As senhas não correspondem. Tente novamente.")
                continue
            print("\n")
            break
    except (EOFError, KeyboardInterrupt):
        print("\n🛑 Cadastro do Admin cancelado.")
        return False

    resultado_hash = criptografar(senha_admin)
    if not resultado_hash['success']:
        print(f"❌ Erro ao gerar hash da senha inicial: {resultado_hash['message']}")
        return False

    cursor.execute(
        f"""
            INSERT INTO {TabelasBancoDeDados.SERVIDORES.value}
                (pk_matricula_servidor, nome, role, senha_hash)
            VALUES (%s, %s, 'Admin', %s)
        """,
        (matricula, nome, resultado_hash['senha_hash'])
    )
    print(f"✅ Administrador {nome} cadastrado com sucesso.")
    return True
