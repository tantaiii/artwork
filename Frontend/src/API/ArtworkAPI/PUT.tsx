import axios from "axios";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { useApiService } from "../../service/api.tsx";

// const updateurl = `${process.env.REACT_APP_API_URL}/artworks/update`;
const urlV1 = "v1/artworks/";

export const useUpdateArtwork = () => {
  const apiService = useApiService();

  const postArtwork = async (artwork: Partial<Artwork>) => {
    const response = await apiService.put(`${urlV1}${artwork._id}`, artwork);
    return response;
  };

  return { postArtwork };
};
