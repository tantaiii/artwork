import { useApiService } from "../../service/api.tsx";

const reportV1Url = `/v1/reports/`;

export const ReportGetAPI = () => {
  const apiService = useApiService();

  const extractData = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data !== undefined) {
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && payload.data !== undefined) return payload.data;
      return payload;
    }
    return res;
  };

  const getAllReports = async () => {
    try {
      const response = await apiService.get(`${reportV1Url}`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  const getAllReportsPending = async () => {
    try {
      const response = await apiService.get(`${reportV1Url}pending`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  const getAllReportsReviewed = async () => {
    try {
      const response = await apiService.get(`${reportV1Url}reviewed`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  const getReportById = async (id: string) => {
    try {
      const response = await apiService.get(`${reportV1Url}${id}`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  return { getAllReports, getAllReportsPending, getAllReportsReviewed, getReportById };
};
