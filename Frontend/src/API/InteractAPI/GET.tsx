import { useApiService } from "../../service/api.tsx";

const v1InteractUrl = "/v1/interacts/";

export const InteractGetAPI = () => {
  const apiService = useApiService();

  const getActivities = async (page: number, limit: number) => {
    try {
      const params = { page, limit };
      const response = await apiService.get(`${v1InteractUrl}`, params);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    getActivities,
  };
};