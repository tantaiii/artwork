import axios from "axios";
import { useApiService } from "../../service/api.tsx";

const aiConversationV1Url = `/v1/conversations/`;

export const AIConversationGetAPI = () => {
  const apiService = useApiService();

  const getConversations = async () => {
    try {
      const response = await apiService.get(aiConversationV1Url);
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };

  return {
    getConversations,
  };
};
