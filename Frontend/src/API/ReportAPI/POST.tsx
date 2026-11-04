import { useApiService } from "../../service/api.tsx";

const reportV1Url = `/v1/reports/`;

export const ReportPostAPI = () => {
  const apiService = useApiService();

  const createReport = async (reportData: any) => {
    try {
      const response = await apiService.post<any>(`${reportV1Url}`, reportData);
      if (!response) {
        throw new Error("No response from server");
      }

      const respAny = response as any;
      if (respAny.status === false) {
        const backendError = respAny.error?.response?.data || respAny.error?.response || respAny.error;
        const errMsg =
          backendError?.message ||
          backendError?.data?.message ||
          respAny.error?.message ||
          respAny.message ||
          "Failed to create report";
        throw new Error(errMsg);
      }

      const backendWrapper = (response as any).data;

      if (backendWrapper && backendWrapper.status !== undefined) {
        const stat = String(backendWrapper.status).toLowerCase();
        if (!(stat === "success" || stat === "true" || stat === "ok")) {
          const message = backendWrapper.message || backendWrapper.error || "Failed to create report";
          throw new Error(message);
        }
      }

      if (backendWrapper && (backendWrapper.status === "success" || backendWrapper.status === true)) {
        return backendWrapper.data ?? backendWrapper;
      }

      return response.data;
    } catch (err) {
      const msg =
        (err && (err as any).message) ||
        (err && (err as any).response && (err as any).response.message) ||
        "Failed to create report";
      throw new Error(msg);
    }
  };

  return { createReport };
};
