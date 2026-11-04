import { useApiService } from "../../service/api.tsx";

const V1PaymentURL = `v1/payments/`;

export const GetPaymentAPI = () => {
  const apiService = useApiService();

  const getPaymentByUserID = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.getNoLoading(
        `${V1PaymentURL}userid`,
        params
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getAllPayments = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.get(`${V1PaymentURL}`, params);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { getPaymentByUserID, getAllPayments };
};
