import { useApiService } from "../../service/api.tsx";

const userV1Url = `v1/users/`;

export const UserDeleteAPI = () => {
  const apiService = useApiService();

  const unfollowUser = async (followingId: string) => {
    try {
      const res = await apiService.delete(`${userV1Url}unfollow/${followingId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    unfollowUser,
  };
};