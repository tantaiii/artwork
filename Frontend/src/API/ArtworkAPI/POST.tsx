import axios from "axios";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";

import { useApiService } from "../../service/api.tsx";

const artworkV1Url = `v1/artworks/`;
// const API_URL = `${process.env.REACT_APP_API_URL}/interact`;

export const useArtworkPostAPI = () => {
  const apiService = useApiService();

  const postImage = async (user: Artwork) => {
    try {
      return await apiService.post(`${artworkV1Url}me`, user);
    } catch (error) {
      throw error;
    }
  };
  return { postImage };
};

export const InteractPOSTAPI = () => {
  const apiService = useApiService();

  const toggleLike = async (artworkID: string) => {
    try {
      const response = await apiService.post(`${artworkV1Url}${artworkID}/like/toggle`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const toggleFavourite = async (artworkID: string) => {
    try {
      const response = await apiService.post(`${artworkV1Url}${artworkID}/favourite/toggle`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };


  return { toggleLike, toggleFavourite };
};
