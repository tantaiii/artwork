import { useApiService } from "../../service/api.tsx";

const rankTransactionV1URL = "/v1/rank-transaction/";

interface UpgradeToArtistPayload {
  userID: string;
  rankID: string;
  dateStartToRent: Date;
  dateEndToRent: null;
  limitUpload: string;
}
export const useRankPostAPI = () => {
  const apiService = useApiService();
  const upgradeRank = async (rankID: any, coin: number) => {
    const response = await apiService.post(`${rankTransactionV1URL}`, {
      rankID: rankID,
      coin: coin,
    });
    return response;
  };

  const upgradeToArtist = async (userID: string) => {
    const payload: UpgradeToArtistPayload = {
      userID,
      rankID: "68de38a170932eaae7db6f0c",
      dateStartToRent: new Date(),
      dateEndToRent: null,
      limitUpload: "200",
    };

    const response = await apiService.post(
      `${rankTransactionV1URL}upgrade-to-artist`,
      payload
    );
    return response;
  };

  return { upgradeRank, upgradeToArtist };
};
