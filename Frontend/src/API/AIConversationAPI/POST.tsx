import axios from "axios";
import { useApiService } from "../../service/api.tsx";

const aiConversationV1Url = `/v1/conversations/`;

export const AIConversationPostAPI = () => {
  const apiService = useApiService();

  const createConversation = async (data: any) => {
    try {
      const response = await apiService.post(aiConversationV1Url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    createConversation,
  };
};
