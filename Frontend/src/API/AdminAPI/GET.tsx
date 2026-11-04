import axios from "axios";
import { useApiService } from "../../service/api.tsx";
import { ArtisForm } from "../../Interfaces/ArtisFormInterface.ts";

const API_BASE = process.env.REACT_APP_API_URL;

const userV1Url = `/v1/users/`;
const artistFormV1Url = `/v1/artis-form`;
const artworkV1Url = `/v1/artworks/`;
const withdrawV1Url = `/v1/withdraws/`;
const transactionV1Url = `/v1/transactions/`;
const paymentsV1Url = `/v1/payments/`;

export const AdminGetAPI = () => {
  const apiService = useApiService();

  const getAllWithdraws = async () => {
    try {
      const res = await apiService.get(withdrawV1Url);
      return res.data.data;
    } catch (err) {
      throw err;
    }
  };
  const extractData = (res: any) => {
    if (!res) return null;
    if (Array.isArray(res)) return res;
    if (res.data !== undefined) {
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && payload.data !== undefined) return payload.data;
      return payload;
    }
    return res;
  };

  const getAllUsers = async () => {
    try {
      const res = await apiService.get(userV1Url);
      return extractData(res);
    } catch (err) {
      throw err;
    }
  };
  const GetNumberOfArtwork = async () => {
    try {
      const res = await apiService.get(artworkV1Url + "count");
      const data = extractData(res);
      // If backend returns wrapper { data: { count: N } } or a plain number
      if (data && typeof data === "object" && data.count !== undefined) return data.count;
      return typeof data === "number" ? data : Number(data) || 0;
    } catch (err) {
      throw err;
    }
  };
  const GetNumberOfUser = async () => {
    try {
      const res = await apiService.get(userV1Url + "count");
      const data = extractData(res);
      if (data && typeof data === "object" && data.count !== undefined) return data.count;
      return typeof data === "number" ? data : Number(data) || 0;
    } catch (err) {
      throw err;
    }
  };

  interface ArtisFormResponse {
    success: boolean;
    data: ArtisForm[];
  }
  const getAllArtisForm = async (): Promise<ArtisFormResponse> => {
    try {
      const res = await apiService.get(artistFormV1Url);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return { getAllUsers, GetNumberOfArtwork, GetNumberOfUser, getAllArtisForm, getAllWithdraws };
};
//---API for Export PDF Report (Don't delete)---

const createApi = (token: string) => {
  return axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const AdminApiService = {
  getAllUsers: async (token: string) => {
    const api = createApi(token);
    const res = await api.get(userV1Url);
    return res.data.data || res.data;
  },

  GetListPaymentInThisMonth: async (token: string) => {
    const api = createApi(token);
    const res = await api.get(paymentsV1Url + "this-month");
    return res.data.data || res.data;
  },

  GetListTransactionInThisMonth: async (token: string) => {
    const api = createApi(token);
    const res = await api.get(transactionV1Url + "this-month");
    return res.data.data || res.data;
  },
};
//End of API for Export PDF Report

//Bỏ
const adminurl = `${(process as any).env.REACT_APP_DNS}/admin`;

export async function GetListArtistForm() {
  try {
    const response = await axios.get(adminurl + "/GetListArtistForm");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListReportsUnfinished() {
  try {
    const response = await axios.get(adminurl + "/ListReportsUnfinished");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListReportsFinished() {
  try {
    const response = await axios.get(adminurl + "/ListReportsFinished");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListUser() {
  try {
    const response = await axios.get(adminurl + "/GetListUserForAdmin");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetNumberOfUser() {
  try {
    const response = await axios.get(adminurl + "/numberofuser");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetNumberOfArtwork() {
  try {
    const response = await axios.get(adminurl + "/numberofartwork");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListActivity() {
  try {
    const response = await axios.get(adminurl + "/ListActivity");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListAllTransactions() {
  try {
    const response = await axios.get(adminurl + "/ListAllTransactions");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function GetListPayment() {
  try {
    const response = await axios.get(adminurl + "/ListPayment");
    return response.data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const GetListWithdrawInProgress = async () => {
  try {
    const response = await axios.get(adminurl + "/GetListWithdrawInProgress");
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawals in progress:", error);
    throw error;
  }
};

export const GetListWithdrawBeAccept = async () => {
  try {
    const response = await axios.get(adminurl + "/GetListWithdrawBeAccept");
    return response.data;
  } catch (error) {
    console.error("Error fetching accepted withdrawals:", error);
    throw error;
  }
};
