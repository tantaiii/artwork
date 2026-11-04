import axios from "axios";
import { Package, CurrentPackage } from "../../Interfaces/Package";
import { useApiService } from "../../service/api.tsx";

const packageUrl = `${process.env.REACT_APP_API_URL}/Rank/`;
const currentPackage = `${process.env.REACT_APP_API_URL}/Rank/Current/`;
const allcurrentPackage = `${process.env.REACT_APP_API_URL}/CurrentPackage/`;

const rankV1Url = "/v1/ranks/";
const rankTransactionV1URL = "/v1/rank-transaction/";

export const useRankGetAPI = () => {
  const apiService = useApiService();

  const getAllRanks = async () => {
    const data = await apiService.get(`${rankV1Url}`);
    return data.data;
  };
  const getPackageByUserID = async () => {
    const response = await apiService.get(`${rankTransactionV1URL}`);
    return response.data;
  };

  return { getAllRanks, getPackageByUserID };
};

export async function GetPackage() {
  try {
    let packList: Package[] = await axios
      .get(packageUrl)
      .then((response) => response.data);
    return packList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetAllCurrentPackage() {
  try {
    let packList: CurrentPackage[] = await axios
      .get(allcurrentPackage)
      .then((response) => response.data);
    return packList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCurrentPackageByAccountID(id: number | undefined) {
  if (!id) {
    return null; // Tránh gọi API nếu id không hợp lệ
  }
  try {
    let response = await axios.get(currentPackage + `${id}`);
    return response.data;
  } catch (err) {
    return null;
  }
}
