import axios from "axios";
import { User, Creator } from "../../Interfaces/UserInterface";
import { ArtisForm } from "../../Interfaces/ArtisFormInterface";
import { Follow } from "../../Interfaces/FollowingInterface";
import { useApiService } from "../../service/api.tsx";
import { WithdrawInterface } from "../../Interfaces/WithdrawInterface.ts";

const userV1Url = `v1/users/`;
const withdrawV1Url = `v1/withdraws`;

export const UserPostAPI = () => {
  const apiService = useApiService();

  const createWithdrawRequest = async (values: Partial<WithdrawInterface>) => {
    try {
      const response = await apiService.post(`${withdrawV1Url}`, values);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const createUserAccount = async (values: Partial<User>) => {
    try {
      const response = await apiService.post(`${userV1Url}`, values);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const createArtistForm = async (values: Partial<ArtisForm>) => {
    try {
      const response = await apiService.post(`${userV1Url}artis-form`, values);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const resetPassword = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiService.post(`${userV1Url}me/password/reset`, {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const followUser = async (followingId: string) => {
    try {
      const res = await apiService.post(`${userV1Url}follow/${followingId}`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    createUserAccount,
    resetPassword,
    createArtistForm,
    followUser,
    createWithdrawRequest,
  };
};

//Bỏ
const postcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;
const changePasswordURL = `${process.env.REACT_APP_API_URL}/Account/changepassword`;
const followUser = `${process.env.REACT_APP_API_URL}/Creator/followers`;

export async function PostChangePassword(values: any) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(changePasswordURL, values, { headers });
    console.log("UploadComplete:", response.data);
    let user: User = response.data;
    return user;
  } catch (err) {
    console.error(err);
  }
}

export async function PostCreator(values: Creator) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(`${postcreatorurl}`, values, { headers });
    console.log("UploadComplete:", response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function PostFollowUser(values: Follow) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    console.log("FUCK");
    console.log(values);
    const response = await axios.post(followUser, values, { headers });
    console.log("Follow Complete:", response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}
