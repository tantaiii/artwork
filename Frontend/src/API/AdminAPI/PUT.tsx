import axios from "axios";
import { useApiService } from "../../service/api.tsx";

const userV1Url = `/v1/users/`;
const artworkV1Url = `/v1/artworks/`;
const artistFormV1Url = `/v1/artis-form`;
const withdrawV1Url = `/v1/withdraws/`;

export const AdminPutAPI = () => {
  const apiService = useApiService();

  const updateStatusWithdraw = async (
    id: string,
    status: "approved" | "rejected",
    message?: string
  ) => {
    const body: any = { status };
    if (status === "rejected" && message) {
      body.message = message;
    }
    await apiService.put(`${withdrawV1Url}${id}/status`, body);
  };

  const lockUserAccount = async (_id: number) => {
    try {
      await apiService.put(`${userV1Url}${_id}/lock`);
    } catch (err) {
      throw err;
    }
  };

  const unlockUserAccount = async (_id: number) => {
    try {
      await apiService.put(`${userV1Url}${_id}/unlock`);
    } catch (err) {
      throw err;
    }
  };

  const updateStatusArtisForm = async (id: string, status: boolean) => {
    try {
      const res = await apiService.put(`${artistFormV1Url}/${id}`, { status });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateArtworkStatus = async (_id: string, status: string) => {
    try {
      const response = await apiService.put(`${artworkV1Url}${_id}/status`, { status });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { lockUserAccount, unlockUserAccount, updateStatusArtisForm, updateArtworkStatus, updateStatusWithdraw };
};

//Bỏ
const adminurl = `${process.env.REACT_APP_DNS}/admin`;
interface ArtistFormDTO {
  formId: number;
  descriptions: string;
  status: number;
  dateCreation: string;
  userId: number;
  rankID: number;
}

export async function LockAccount(accountId: number) {
  try {
    await axios.put(`${adminurl}/LockAccount/${accountId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function UnlockAccount(accountId: number) {
  try {
    await axios.put(`${adminurl}/UnlockAccount/${accountId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function AcceptToUpgrade(dto: ArtistFormDTO) {
  try {
    await axios.put(`${adminurl}/AcceptToUpgrade/`, dto);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function UpdateReportStatus(reportId: number) {
  try {
    await axios.put(`${adminurl}/updateStatus/${reportId}`);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const AcceptWithdraw = async (withdrawId: number) => {
  try {
    const response = await axios.put(adminurl + `/AcceptWithdraw/${withdrawId}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting withdraw:", error);
    throw error;
  }
};
