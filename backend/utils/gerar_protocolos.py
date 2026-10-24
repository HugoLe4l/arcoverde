import random
import string
from datetime import datetime


def gerar_protocolo():
    data = datetime.now().strftime("%Y%m%d")
    aleatorio = ''.join(random.choices(
        string.ascii_uppercase + string.digits,
        k=7
    ))

    return f"ARC-{data}-{aleatorio}"
