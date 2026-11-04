import axios from "axios";

import { useApiService } from "../../service/api.tsx";

const userV1Url = `v1/users/`;

// const profilecreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;
// const backgroundcreatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;
// const changePasswordURL = `${process.env.REACT_APP_API_URL}/Account/changepassword`;
// const creatorurl = `${process.env.REACT_APP_API_URL}/Creator/`;

export const UserPutAPI = () => {
  const apiService = useApiService();

  const changePassword = async (oldPassword: string, password: string) => {
    try {
      return await apiService.put(`${userV1Url}me/password`, {
        oldPassword,
        password,
      });
    } catch (err) {}
  };

  const putProfile = async (values: {
    firstName?: string;
    lastName?: string;
    address?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
    biography?: string;
  }) => {
    try {
      return (await apiService.put(`${userV1Url}me/profile`, values)).data;
    } catch (err: any) {}
  };

  const markAsReadNotificationByMe = async () => {
    try {
      return (await apiService.putNoLoading(`${userV1Url}me/notifications`))
        .data;
    } catch (err: any) {}
  };
  const PutCreatorBackgroundPicture = async (base64: string) => {
    try {
      const response = await apiService.put(`${userV1Url}me/background`, {
        background: base64,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const PutCreatorAvaterPicture = async (base64: string) => {
    try {
      const response = await apiService.put(`${userV1Url}me/avatar`, {
        avatar: base64,
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  return {
    changePassword,
    putProfile,
    markAsReadNotificationByMe,
    PutCreatorBackgroundPicture,
    PutCreatorAvaterPicture,
  };
};
