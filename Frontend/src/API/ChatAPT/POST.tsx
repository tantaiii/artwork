import { useApiService } from "../../service/api.tsx";

const messagesURL = `v1/messages/`;
const v1ChatURL = `v1/chats/`;

export const useChatPost = () => {
  const apiService = useApiService();
  const createChat = async (values: any) => {
    try {
      await apiService.post(`${v1ChatURL}me`, values).then((res) => res.data);
    } catch {
      return null;
    }
  };

  const sendMessage = async (values: any) => {
    try {
      await apiService
        .postNoLoading(`${messagesURL}me`, values)
        .then((res) => res.data);
    } catch {
      return null;
    }
  };
  return { createChat, sendMessage };
};
