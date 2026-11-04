import { useApiService } from "../../service/api.tsx";
const v1TransactionUrl = "v1/transactions/";

export const GetTransactionApi = () => {
  const apiService = useApiService();

  const getTransaction = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.get(`${v1TransactionUrl}`, params);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  const getTransactionByArtworkId = async (id: string) => {
    try {
      const response = await apiService.get(`${v1TransactionUrl}${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getTransactionByBuyerId = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.getNoLoading(
        `${v1TransactionUrl}buyers`,
        params
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getTransactionBySellerId = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.getNoLoading(
        `${v1TransactionUrl}sellers`,
        params
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return {
    getTransaction,
    getTransactionByArtworkId,
    getTransactionByBuyerId,
    getTransactionBySellerId,
  };
};
