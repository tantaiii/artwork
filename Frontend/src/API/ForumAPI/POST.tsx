import axios from "axios";
import { useApiService } from "../../service/api.tsx";
import { ApiResponse } from "../../Interfaces/app.common";

const threadV1Url = `/v1/threads/`;
const CommentsThreadV1Url = `/v1/comment-threads/`;

export const ForumPostAPI = () => {
  const apiService = useApiService();

  const UploadThread = async (data: {
    TitleThread: string;
    ThreadDescription: string;
  }) => {
    const response = await apiService.post(threadV1Url, data);
    return response.data;
  };

  const postComment = async (data: any) => {
    const response = await apiService.post(`${CommentsThreadV1Url}`, data);
    return response.data;
  };

  return {
    UploadThread,
    postComment,
  };
};

export const ThreadInteractPOSTAPI = () => {
  const apiService = useApiService();

  const toggleLike = async (threadID: string) => {
    try {
      const response = await apiService.post(`${threadV1Url}${threadID}/like/toggle`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { toggleLike };
};

// Bỏ
const threadurl = `${process.env.REACT_APP_API_URL}/Forum/thread/`;

interface ThreadUploadData {
  titleThread: string;
  threadDescription: string;
  topicID: number;
  userId: number;
}

export const UploadThread = async (data: ThreadUploadData) => {
  try {
    if (!data.userId) {
      throw new Error("UserID is required");
    }

    console.log("Starting thread upload with data:", {
      ...data,
      threadDescription: data.threadDescription.substring(0, 50) + "...",
    });

    // Tạo DateCreated ở định dạng ISO 8601 với múi giờ UTC+7 (Asia/Bangkok)
    const now = new Date();
    const utc7Date = new Date(now.getTime() + 7 * 60 * 60 * 1000); // Thêm 7 giờ cho UTC+7
    const dateStr = utc7Date.toISOString().replace(/\.\d+Z$/, "Z"); // Định dạng thành "YYYY-MM-DDTHH:mm:ssZ"

    const requestData = {
      ThreadID: "0", // Không cần gửi ThreadID nếu backend tự tăng
      TitleThread: data.titleThread,
      ThreadDescription: data.threadDescription,
      Likes: 0, // Chuyển từ "0" sang số nguyên
      Comments: 0, // Chuyển từ "0" sang số nguyên
      DateCreated: dateStr, // VD: "2025-03-05T14:05:00Z" (UTC+7)
      TopicID: data.topicID,
      UserID: data.userId,
    };

    console.log("Sending request with data:", requestData);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/Forum/thread`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Thread creation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      userID: data.userId,
      topicID: data.topicID,
    });
    throw error;
  }
};

export async function ToggleLike(userID: number, threadID: number) {
  try {
    const response = await axios.post(`${threadurl}like/toggle`, {
      userID,
      threadID,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm/bỏ Like:", error);
    return null;
  }
}
