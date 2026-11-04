import axios from "axios";
import { Creator } from "../../Interfaces/UserInterface";
import { Chat, Message } from "../../Interfaces/ChatInterfaces";
import { useApiService } from "../../service/api.tsx";

const chatURL = `${process.env.REACT_APP_API_URL}/chat/`;
const v1ChatURL = `v1/chats/`;
const v1MessageURL = `v1/messages/`;
export const useChatGet = () => {
  const apiService = useApiService();
  const getChatSelf = async () => {
    try {
      const response = await apiService.get(`${v1ChatURL}me`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  const getMessageSelf = async () => {
    try {
      const response = await apiService.get(`${v1MessageURL}me`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getChatByMeAndOther = async (_id: string) => {
    try {
      const response = await apiService.getNoLoading(
        `${v1ChatURL}me/other/${_id}`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return { getChatSelf, getMessageSelf, getChatByMeAndOther };
};
