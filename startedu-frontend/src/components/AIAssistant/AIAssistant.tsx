import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./AIAssistant_style.module.css";
import { obterUsuario } from "../../services/authService";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Olá! Sou o assistente da StartEdu. Como posso ajudar você a encontrar a moradia ideal para seus estudos?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<null | HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);

  // Rolagem automática para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Foca no input quando o chat é aberto
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Se estamos abrindo o chat, também expandimos o botão
    if (!isOpen) {
      setExpanded(true);
      setTimeout(() => setExpanded(false), 500);
    }
  };

  // Modifique a função sendMessage para processar corretamente a resposta
  const sendMessage = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Obtém o ID do usuário para personalizar respostas
      const usuario = obterUsuario();
      const userId = usuario?.id || "guest";

      // Defina o tipo esperado da resposta da API
      interface AskResponse {
        response: string | { content?: string };
      }

      // Chamada para o backend da IA
      const response = await axios.post<AskResponse>(
        "http://localhost:8000/ask",
        {
          user_id: userId,
          question: message,
        }
      );

      // Extrair a resposta como string, garantindo que seja texto
      let responseText = "";

      if (response.data && response.data.response) {
        // Verifica se a resposta é um objeto ou string
        if (typeof response.data.response === "object") {
          // Se for um objeto, tenta extrair o conteúdo ou converte para string
          responseText =
            response.data.response.content ||
            JSON.stringify(response.data.response);
        } else {
          // Se for uma string, usa diretamente
          responseText = String(response.data.response);
        }
      } else {
        responseText = "Desculpe, não consegui processar sua solicitação.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: responseText,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar mensagem para o assistente:", error);

      setMessages((prev) => [
        ...prev,
        {
          text: "Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={styles.assistantContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <div className={styles.assistantAvatar}>
                <div className={styles.avatarPulse}></div>
              </div>
              <h3>Assistente StartEdu</h3>
            </div>
            <button className={styles.closeButton} onClick={toggleChat}>
              ×
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.isUser ? styles.userMessage : styles.assistantMessage
                }`}
              >
                {!msg.isUser && <div className={styles.assistantIcon}></div>}
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{msg.text}</div>
                  <div className={styles.messageTime}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.assistantIcon}></div>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte algo sobre imóveis..."
              disabled={isTyping}
            />
            <button
              className={styles.sendButton}
              onClick={sendMessage}
              disabled={isTyping || message.trim() === ""}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2L11 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        className={`${styles.chatButton} ${expanded ? styles.expanded : ""} ${
          isOpen ? styles.active : ""
        }`}
        onClick={toggleChat}
        aria-label="Assistente IA"
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <>
            <div className={styles.buttonIcon}>
              <div className={styles.holoCore}></div>
              <div className={styles.holoRing}></div>
              <div className={styles.holoRing}></div>

              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <circle cx="12" cy="12" r="2" fill="white" />
                <path
                  d="M12 17V19.5"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M12 4.5V7"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M17 12H19.5"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M4.5 12H7"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5355 15.5355L17.3033 17.3033"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M6.6967 6.6967L8.46447 8.46447"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5355 8.46447L17.3033 6.6967"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M6.6967 17.3033L8.46447 15.5355"
                  stroke="white"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className={styles.buttonText}>Assistente IA</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
