import bcrypt

def criptografar(SENHA_ORIGINAL):
    try:
        senha_bytes = SENHA_ORIGINAL.encode('utf-8')

        salt = bcrypt.gensalt()

        hash_senha = bcrypt.hashpw(senha_bytes, salt)

        return {
                'success': True,
                'senha_hash':  hash_senha.decode()            
            } 
    except Exception as erro:
         return {
                'success': False,
                'message': f"Houve um error ao realizar a criptografia: {erro}",              
            }

def Compare(SENHA_RECEBIDA, SENHA_HASH):
    try:

        if bcrypt.checkpw(SENHA_RECEBIDA.encode('utf-8'), SENHA_HASH.encode('utf-8')):
            return True 
        else:
            return False 
        
    except Exception as erro:
         return {
                'success': False,
                'message': f"Houve um error ao realizar a comparação: {erro}",              
            }


