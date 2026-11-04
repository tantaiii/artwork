import { useApiService } from "../../service/api.tsx";
const V1PaymentURL = `v1/payments/`;

export const PaymentPutAPI = () => {
  const apiService = useApiService();
  const acceptPayment = async (orderCodepPayment: number) => {
    try {
      const response = await apiService.put(`${V1PaymentURL}accept`, {
        orderCode: orderCodepPayment,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  return { acceptPayment };
};
