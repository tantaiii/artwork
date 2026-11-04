import { useApiService } from "../../service/api.tsx";
// import { ArtworkTransaction } from "../../Interfaces/ArtworkInterfaces.ts";
const v1TransactionUrl = "v1/transactions/";

export const PostTransactionApi = () => {
  const apiService = useApiService();

  const postTransaction = async (value: any) => {
    try {
      const response = await apiService.post(`${v1TransactionUrl}`, value);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { postTransaction };
};
