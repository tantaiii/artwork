import axios from "axios";
import { ArtworkTransaction } from "../../Interfaces/ArtworkInterfaces.ts";
import { useApiService } from "../../service/api.tsx";

const arturl = `${process.env.REACT_APP_API_URL}/artworks`;
const transactionurl = `${process.env.REACT_APP_API_URL}/transaction`;
const v1TransactionUrl = "v1/transactions/";

export const getArtWithStatus = (userId, pageNumber) => {
  return axios.get(
    `${arturl}/GetArtworksWithPaymentStatus?userId=${userId || ""}&pageNumber=${
      pageNumber || 1
    }&pageSize=8`
  );
};

export const getArtDetail = (id) => {
  return axios.get(arturl + "/" + id);
};

interface BuyartResponse {
  success?: boolean;
  insufficientFunds?: boolean;
  message?: string;
}

export async function Buyart(
  payload: ArtworkTransaction
): Promise<BuyartResponse> {
  try {
    console.log("Making request with payload:", payload);
    const response = await axios.post(
      `${transactionurl}/SaveTransaction`,
      payload
    );
    if (response.data === "Transaction saved successfully.") {
      return { success: true };
    }
    return { success: false, message: response.data };
  } catch (error: any) {
    console.error("API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });

    // For 400 Bad Request errors
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      console.log("Bad Request Error Data:", errorData);

      return {
        success: false,
        message:
          "Invalid transaction data. Please check all fields are correct.",
      };
    }

    // For insufficient funds
    if (error.response?.data === "Insufficient funds") {
      return { insufficientFunds: true, message: "Insufficient funds" };
    }

    // For any other errors
    return {
      success: false,
      message: "Transaction failed. Please try again.",
    };
  }
}
