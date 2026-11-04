import axios from "axios";
import { useApiService } from "../../service/api.tsx";

const mailV1Url = `v1/mail/`;

export const MailPostAPI = () => {
  const apiService = useApiService();

  const sendMail = async (email: string) => {
    try {
      // Request the backend and keep TypeScript happy by specifying generic
      const response = await apiService.post<any>(`${mailV1Url}token`, {
        email,
      });
      // apiService.post trả về ApiResponse: { status: boolean, data: <backend payload>, ... }
      const payload = response?.data;
      // backend trả về { status: 'success', message: ..., data: { token: '123456' } }
      // hoặc trả trực tiếp token => cố gắng lấy token ở các vị trí có thể
      const token = payload?.data?.token ?? payload?.token ?? payload ?? null;
      return token;
    } catch (err) {
      throw err;
    }
  };

  return { sendMail };
};
