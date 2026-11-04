import { Tag } from "../../Interfaces/TagInterface";
import axios from "axios";
import { useApiService } from "../../service/api.tsx";

const tagUrl = `/v1/tags/`;
export const useTagGetAPI = () => {
  const apiService = useApiService();
  const getTagList = async () => {
    try {
      const tagList: any = await apiService.get(tagUrl);
      return tagList.data.data! as Tag[] | undefined;
    } catch (err) {
      console.log(err);
    }
  };

  const getTagById = async (id: string) => {
    try {
      const response = await apiService.get(`${tagUrl}${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getArtworkByTagID = async (tagId: string) => {
    try {
      const response = await apiService.get(`${tagUrl}${tagId}/artworks`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return { getTagList, getTagById, getArtworkByTagID };
};
