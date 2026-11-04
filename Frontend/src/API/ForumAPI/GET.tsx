import { Account, Creator } from "../../Interfaces/UserInterface.tsx";
import axios from "axios";
import { useApiService } from "../../service/api.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import {
  TypeOfTopic,
  Topic,
  Thread,
} from "../../Interfaces/ForumInterfaces.ts";

const threadV1Url = `/v1/threads/`;
const typeoftopicV1Url = `/v1/typeoftopics/`;
const topicV1Url = `/v1/topics/`;
const CommentsThreadV1Url = `/v1/comment-threads/`;

export const ForumGetAPI = () => {
  const apiService = useApiService();

  const extractData = (res: any) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data !== undefined) {
      const payload = res.data;
      if (Array.isArray(payload)) return payload;
      if (payload && payload.data !== undefined) return payload.data;
      return payload;
    }
    return res;
  };

  const getTypesOfTopic = async () => {
    try {
      const response = await apiService.get(typeoftopicV1Url);
      const serverPayload = response?.data ?? response;
      const result = serverPayload?.data ?? serverPayload;
      return result;
    } catch (err) {
      throw err;
    }
  };
  const getTopicsByTypeId = async (typeID: string | number) => {
    try {
      const url = `${topicV1Url}type/${typeID}`;
      const response = await apiService.get(url);
      const serverPayload = response?.data ?? response;
      const result = serverPayload?.data ?? serverPayload;
      return result;
    } catch (err) {
      throw err;
    }
  };
  const getTopicById = async (topicID: string) => {
    try {
      const response = await apiService.get(`${topicV1Url}${topicID}`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };
  const getThreadsByTopicId = async (topicID: string) => {
    try {
      const response = await apiService.get(`${threadV1Url}topic/${topicID}`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };
  const getThreadById = async (threadID: string) => {
    try {
      const response = await apiService.get(`${threadV1Url}${threadID}`);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  const getTopicsByTypeIdWithInfo = async (typeID: string | number) => {
    try {
      const url = `${topicV1Url}type/${typeID}/with-threads-info`;
      const response = await apiService.get(url);
      return extractData(response);
    } catch (err) {
      throw err;
    }
  };

  const getAllCommentsByThreadId = async (threadID: string) => {
    try {
      const response = await apiService.get(
        `${threadV1Url}${threadID}/comments/`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    getTypesOfTopic,
    getTopicsByTypeId,
    getTopicById,
    getTopicsByTypeIdWithInfo,
    getThreadsByTopicId,
    getThreadById,
    getAllCommentsByThreadId,
  };
};

export const ThreadInteractGetAPI = () => {
  const apiService = useApiService();

  const getLikeStatus = async (threadID: string) => {
    try {
      const response = await apiService.get(`${threadV1Url}${threadID}/like/status`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getLikeCount = async (threadID: string) => {
    try {
      const response = await apiService.get(`${threadV1Url}${threadID}/like/count`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    getLikeStatus,
    getLikeCount,
  };
};

// Bỏ
const typeoftopicurl = `${process.env.REACT_APP_API_URL}/Forum/typeTopic`;
const topicurl = `${process.env.REACT_APP_API_URL}/Forum/topic/`;
const forumurl = `${process.env.REACT_APP_API_URL}/Forum/`;
const threadurl = `${process.env.REACT_APP_API_URL}/Forum/thread/`;

export async function GetTypesOfTopic() {
  try {
    const response = await axios.get(typeoftopicurl);
    return response.data as APITypeOfTopic[];
  } catch (err) {
    console.log("Error getting types of topic:", err);
    return [];
  }
}

export async function GetTopics(typeID: number) {
  try {
    const response = await axios.get(topicurl + typeID);
    return response.data as APITopic[];
  } catch (err) {
    console.log("Error getting topics:", err);
    return [];
  }
}

export async function GetTopicById(topicID: string) {
  try {
    console.log("Getting topic details for ID:", topicID);
    const response = await axios.get(`${topicurl}title/${topicID}`);
    console.log("Topic details response:", response.data);
    return response.data as APITopic;
  } catch (err) {
    console.error("Error getting topic details:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return null;
  }
}

export async function GetListThread(topicID: string) {
  try {
    console.log("Getting threads for topicID:", topicID);
    const response = await axios.get(`${forumurl}${topicID}/GetThread`);
    console.log("Thread API response:", response.data);
    return response.data as APIThread[];
  } catch (err) {
    console.error("Error getting threads:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return [];
  }
}

export async function GetThreadByID(threadID: string) {
  try {
    console.log("Getting thread details for ID:", threadID);
    const response = await axios.get(`${threadurl}${threadID}`);
    console.log("Thread details response:", response.data);
    return response.data as APIThread;
  } catch (err) {
    console.error("Error getting thread details:", err);
    if (axios.isAxiosError(err)) {
      console.error("API Error details:", err.response?.data);
    }
    return null;
  }
}

export async function CheckLikeStatus(userID: number, threadID: number) {
  try {
    const response = await axios.get(`${threadurl}like/${userID}/${threadID}`);
    return response.data; // Trả về true/false
  } catch (error) {
    return false;
  }
}

export const GetLikeCount = async (threadID: number) => {
  try {
    const response = await axios
      .get(`${threadurl}likecount/${threadID}`)
      .then((res) => res.data);
    return await response; // số lượng like
  } catch (error) {
    console.error("Error getting like count:", error);
    return 0;
  }
};
