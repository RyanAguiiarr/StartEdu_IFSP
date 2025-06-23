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
Você é um assistente inteligente do sistema StartEdu.
Aqui estão os imóveis cadastrados no sistema:

{dados}

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
    dados_imoveis = get_imoveis_disponiveis()

    # Pega o histórico desse usuário
    history = user_memory.get(user_id, [])

    # Formata o histórico como texto
    history_text = ""
    for msg in history:
        history_text += f"{msg['role']}: {msg['content']}\n"

    # Preenche o prompt
    prompt_filled = prompt.format(
        dados=dados_imoveis,
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
