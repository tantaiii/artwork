import { Creator, User } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";
import { useApiService } from "../../service/api.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { INotification } from "../../Interfaces/NotificationInterfaces.ts";

const creatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;
const getallcreator = `${process.env.REACT_APP_API_URL}/Creator`;
const userV1Url = `v1/users/`;
const countcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/CountCreators`;

const gettotalartworklikesbycreatorurl = `${process.env.REACT_APP_API_URL}/artworks/total-likes/`;
const top10UsersUrl = `${process.env.REACT_APP_API_URL}/Creator/top-popular`;
const checkFollow = `${process.env.REACT_APP_API_URL}/Follow/checkFollow`;
const getUserByIdUrl = `${process.env.REACT_APP_API_URL}/Creator/userID/`;

export const UserGetAPI = () => {
  const apiService = useApiService();

  const getUserByIdUrl = async (id: any) => {
    try {
      const response = await apiService.get(`${userV1Url}${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getCheckExistEmail = async (email: string) => {
    try {
      const response: any = await apiService.get(`${userV1Url}exist/${email}`);
      return response?.data?.data?.exists ?? response?.data?.exists ?? false;
    } catch (err) {
      throw err;
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await apiService.get(userV1Url);
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  const getAllUsersPopulated = async () => {
    try {
      const res = await apiService.get(`${userV1Url}populated`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  const getTop10Users = async () => {
    const res = await apiService.get(`${userV1Url}top10`);
    return res.data?.data || [];
  };

  const getNotificationByUserId = async () => {
    const res = (await apiService.get(`${userV1Url}me/notifications`))
      .data as ApiResponse<INotification[]>;
    return res || [];
  };

  const getAllUserForSearch = async () => {
    try {
      const res = await apiService.getNoLoading(`${userV1Url}search`);
      return res.data as ApiResponse<User[]>;
    } catch (err) {
      throw err;
    }
  };
  const checkFollowing = async (followingId: string) => {
    try {
      const res = await apiService.get(
        `${userV1Url}is-following/${followingId}`
      );
      return res.data?.data?.isFollowing || false;
    } catch (err) {
      throw err;
    }
  };

  const getAvatarUser = async () => {
    try {
      const res = await apiService.get(`${userV1Url}me/avatar`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const getBackgroundUser = async () => {
    try {
      const res = await apiService.get(`${userV1Url}me/background`);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    getUserByIdUrl,
    getCheckExistEmail,
    getAllUsers,
    getTop10Users,
    getNotificationByUserId,
    getAllUserForSearch,
    checkFollowing,
    getAvatarUser,
    getBackgroundUser,
    getAllUsersPopulated,
  };
};

export async function GetUserNameById(userId: string | number) {
  try {
    const response = await axios.get(getUserByIdUrl + userId);
    const userData = response.data;

    if (!userData || (!userData.firstName && !userData.lastName)) {
      console.warn(
        `⚠️ Không tìm thấy firstName hoặc lastName cho userID ${userId}`
      );
      return "Unknown User";
    }

    return `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim(); // ✅ Ghép firstName + lastName
  } catch (err) {
    console.error(`❌ Lỗi khi lấy userName cho userID ${userId}:`, err);
    return "Unknown User";
  }
}

export async function GetTop10Users() {
  try {
    let users: Creator[] = await axios
      .get(top10UsersUrl)
      .then((response) => response.data);
    return users;
  } catch (err) {
    console.log("Lỗi khi lấy top 10 người dùng phổ biến:", err);
  }
}

export async function GetTotalLikeByCreatorID(id: string | number) {
  try {
    let total: number = await axios
      .get(gettotalartworklikesbycreatorurl + id)
      .then((response) => response.data);
    return total;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListNoImage() {
  try {
    let creatorList: Creator[] = await axios
      .get(creatorurl.replace(/\/$/, ""))
      .then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListNoBackground() {
  try {
    let creatorList: Creator[] = await axios
      .get(creatorurl)
      .then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorListCount() {
  try {
    const response = await axios.get(countcreatorurl);
    return response.data as number;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export async function GetCreatorList() {
  try {
    let creatorList: Creator[] = await axios
      .get(getallcreator)
      .then((response) => response.data);
    return creatorList;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorByAccountID(accountId: string) {
  //GET by Account ID
  try {
    let creator: Creator = await axios
      .get(creatorurl + accountId)
      .then((response) => response.data);
    return creator;
  } catch (err) {
    console.log(err);
  }
}

export async function GetCreatorByID(creatorId: string) {
  //GET by Creator ID
  try {
    let creator: Creator = await axios
      .get(creatorurl + `userID/${creatorId}`)
      .then((response) => response.data);
    return creator;
  } catch (err) {
    console.log(err);
  }
}

export async function CheckFollowStatus(
  followerId: number,
  followingId: number
) {
  try {
    const response = await axios.get(checkFollow, {
      params: {
        followerId,
        followingId,
      },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
}
