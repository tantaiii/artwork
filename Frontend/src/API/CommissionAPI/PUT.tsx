
import { ICommissionForm } from "../../Interfaces/CommissionForm"
import axios from 'axios'
import { useApiService } from "../../service/api.tsx";


const getcommssionformurl = `${process.env.REACT_APP_API_URL}/CommissionForm/`
const commissionV1Url = `v1/commissions/`;


const headers = {
  'Content-Type': 'application/json',
};
export async function PutCommissionFormById(values: ICommissionForm, id: string | number) {
  try {
    let response = await axios.put(getcommssionformurl + id, values, { headers }).then(response => response.data)
    return response
  } catch (err) {
    throw err;
  }
}

export const useCommissionPutAPI = () => {
  const apiService = useApiService();

  const putAcceptCommissionById = async (id: string): Promise<any> => {
    try {
      const response = await apiService.putNoLoading(`${commissionV1Url}${id}/accept`, {});

      if (response.status && !response.error) {
        return response.data;
      } else {
        throw new Error(response.error?.message || "Unknown error");
      }
    } catch (err) {
      throw err;
    }
  };

  const putRejectCommissionById = async (id: string, message: string): Promise<any> => {
    try {
      const response = await apiService.putNoLoading(`${commissionV1Url}${id}/reject`, { message });
      if (response.status && !response.error) {
        return response.data;
      } else {
        throw new Error(response.error?.message || "Unknown error");
      }
    } catch (err) {
      throw err;
    }
  };

  const putUpdateProgressById = async (id: string, progress: number, artworkURL?: string): Promise<any> => {
    try {
      const body: any = { progress };
      if (artworkURL) {
        body.artworkURL = artworkURL;
      }
      const response = await apiService.putNoLoading(`${commissionV1Url}${id}/progress`, body);
      if (response.status && !response.error) {
        return response.data;
      } else {
        throw new Error(response.error?.message || "Unknown error");
      }
    } catch (err) {
      throw err;
    }
  };

  return { putAcceptCommissionById, putRejectCommissionById, putUpdateProgressById };
};