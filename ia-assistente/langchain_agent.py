from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from database import create_connection


# 🔸 Dicionário de memória por usuário
user_memory = {}


# 🔥 IA rodando no Ollama local
llm = ChatOllama(
    model="llama3",  # Pode ser 'llama3', 'mistral', 'phi3', 'gemma'
    temperature=0.2
)


# 🏡 Consulta simples dos imóveis
def get_imoveis_disponiveis():
    connection = create_connection()
    if not connection:
        return "Não foi possível conectar ao banco de dados."

    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT nome, endereco, descricao, preco
            FROM imovel
            LIMIT 5;
        """
        cursor.execute(query)
        resultados = cursor.fetchall()

        if not resultados:
            return "Nenhum imóvel cadastrado no momento."

        texto = "Lista de imóveis disponíveis:\n"
        for imovel in resultados:
            texto += (
                f"- {imovel['nome']} | {imovel['endereco']} | "
                f"{imovel['descricao']} | R${imovel['preco']}\n"
            )

        return texto

    except Exception as e:
        return f"Erro na consulta: {str(e)}"

    finally:
        cursor.close()
        connection.close()


# 🧠 Prompt com memória
prompt_template = """
Você é um assistente inteligente do sistema StartEdu, uma plataforma para conectar estudantes a imóveis para aluguel próximos a instituições de ensino.

Você tem acesso aos seguintes dados do sistema:

{dados}

Use essas informações para responder às perguntas dos usuários de forma útil e precisa.
Você pode fazer recomendações personalizadas com base nos dados disponíveis.

Histórico da conversa:
{history}

Pergunta atual do usuário:
{question}

Resposta:
"""

prompt = PromptTemplate(
    input_variables=["dados", "history", "question"],
    template=prompt_template
)


# 🚀 Função que processa a pergunta com memória
def process_question(user_id: str, question: str) -> str:
    # Obtém dados completos do sistema
    system_data = get_system_data()

    # Pega o histórico desse usuário
    history = user_memory.get(user_id, [])

    # Formata o histórico como texto
    history_text = ""
    for msg in history:
        history_text += f"{msg['role']}: {msg['content']}\n"

    # Preenche o prompt
    prompt_filled = prompt.format(
        dados=system_data,
        history=history_text,
        question=question
    )

    # Envia para a IA
    response = llm.invoke(prompt_filled)

    # Atualiza memória
    if user_id not in user_memory:
        user_memory[user_id] = []

    user_memory[user_id].append({"role": "user", "content": question})
    user_memory[user_id].append({"role": "assistant", "content": response})

    return response


# 🔄 Função opcional para limpar memória
def clear_memory(user_id: str):
    if user_id in user_memory:
        del user_memory[user_id]


def get_system_data():
    """Obtém dados de várias tabelas do sistema para fornecer contexto completo à IA"""
    connection = create_connection()
    if not connection:
        return "Não foi possível conectar ao banco de dados."

    cursor = connection.cursor(dictionary=True)
    data = {}

    try:
        # Consulta imóveis
        cursor.execute("""
            SELECT id, nome, endereco, numero, descricao, num_quartos, 
                   num_banheiros, mobiliado, status, localizacao, preco
            FROM imovel
        """)
        data['imoveis'] = cursor.fetchall()

        # Consulta alunos
        cursor.execute("""
            SELECT a.id, a.nome, a.email, a.telefone, a.sexo
            FROM aluno a
        """)
        data['alunos'] = cursor.fetchall()

        # Consulta cursos
        cursor.execute("""
            SELECT id, nome, sigla
            FROM curso
        """)
        data['cursos'] = cursor.fetchall()

        # Consulta campus
        cursor.execute("""
            SELECT id, nome, endereco, telefone, email
            FROM campus
        """)
        data['campus'] = cursor.fetchall()

        # Formata os dados para o prompt
        result = "DADOS DO SISTEMA:\n\n"

        # Imóveis
        result += "IMÓVEIS:\n"
        for imovel in data['imoveis']:
            result += f" Nome: {imovel['nome']} | Endereço: {imovel['endereco']}, {imovel['numero']} | "
            result += f"Quartos: {imovel['num_quartos']} | Banheiros: {imovel['num_banheiros']} | "
            result += f"Preço: R$ {imovel['preco']} | Mobiliado: {'Sim' if imovel['mobiliado'] else 'Não'}\n"
            result += f"Descrição: {imovel['descricao']}\n"

        # Alunos (com informações limitadas por privacidade)
        result += "\nALUNOS:\n"
        for aluno in data['alunos']:
            result += f" Nome: {aluno['nome']} | Contato: {aluno['email']}\n"

        # Cursos
        result += "\nCURSOS:\n"
        for curso in data['cursos']:
            result += f" Nome: {curso['nome']} | Sigla: {curso['sigla']}\n"

        # Campus
        result += "\nCAMPUS:\n"
        for campus in data['campus']:
            result += f"Nome: {campus['nome']} | Endereço: {campus['endereco']} | Contato: {campus['email']}\n"

        return result

    except Exception as e:
        return f"Erro na consulta: {str(e)}"

    finally:
        cursor.close()
        connection.close()
