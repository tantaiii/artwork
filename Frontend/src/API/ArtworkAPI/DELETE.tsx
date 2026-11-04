import { ApiResponse } from "../../Interfaces/app.common.ts";
import { useApiService } from "../../service/api.tsx";

const artworkV1Url = `v1/artworks/`;

export const useDeleteArtwork = () => {
  const apiService = useApiService();
  const deleteArtById = async (id: string) => {
    const respone = await apiService.delete(`${artworkV1Url}${id}`);
    return respone;
  };
  return { deleteArtById };
};
