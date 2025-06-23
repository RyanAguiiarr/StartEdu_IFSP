/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

interface AssistantQuery {
  user_id: string;
  question: string;
}

interface AssistantResponse {
  response: string;
}

export const askAssistant = async (query: AssistantQuery): Promise<string> => {
  try {
    const response = await axios.post<AssistantResponse>(
      `${API_BASE_URL}/ask`,
      query
    );
    return response.data.response;
  } catch (error) {
    console.error("Erro ao comunicar com o assistente:", error);
    throw new Error("Não foi possível conectar ao assistente.");
  }
};

export const checkAssistantStatus = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}`);
    return true;
  } catch (error) {
    return false;
  }
};
