import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";
import { useApiService } from "../../service/api.tsx";

const chatURL = `${process.env.REACT_APP_API_URL}/chat/`;

const headers = {
  "Content-Type": "application/json",
};
const v1ChatURL = `v1/chats/`;

export const useChatPut = () => {
  const apiService = useApiService();
  const markAsReadChat = async () => {
    try {
      await apiService.put(`${v1ChatURL}me`);
    } catch {
      return null;
    }
  };

  return { markAsReadChat };
};
export const updateStatusChatByUserId = async (values: Chat) => {
  try {
    await axios.put(`${chatURL}`, values, { headers }).then((res) => res.data);
  } catch {
    return null;
  }
};
