import { useApiService } from "../../service/api.tsx";

const reportV1Url = `/v1/reports/`;

export const ReportPutAPI = () => {
  const apiService = useApiService();
  const changeStatusReportToReviewed = async (reportID: string) => {
    try {
      const response = await apiService.put(`${reportV1Url}${reportID}/reviewed`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { changeStatusReportToReviewed };
};
