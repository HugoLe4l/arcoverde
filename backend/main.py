from flask import Flask
from flask_cors import CORS
from config.database import criarDB
from config.init_db import init_db

 
from routes.cidadaos_route import cidadoes_routes
from routes.solicitacoes_route import solicitacoes_routes
from routes.servidor_route import servidor_routes
from routes.categorias_route import categorias_routes
from routes.orgaos_route import orgaos_routes


app = Flask(__name__)
CORS(app, origins="*")
port = 5000

app.register_blueprint(cidadoes_routes)
app.register_blueprint(solicitacoes_routes)
app.register_blueprint(servidor_routes)
app.register_blueprint(categorias_routes)
app.register_blueprint(orgaos_routes)


if __name__ == "__main__":
    print(f"\n> Servidor rodando na porta {port}")
    criarDB() #Apenas cria o banco
    init_db() #Apenas cria as tabelas

    app.run(port=port)
    