import { useApiService } from "../../service/api.tsx";

const replyCommentV1Url = `v1/replies/`;

export const useReplyCommentGetAPI = () => {
  const apiService = useApiService();
  const getRepliesByCommentId = async (commentId: string) => {
    try {
      const response = await apiService.get(`${replyCommentV1Url}${commentId}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getAllReplies = async () => {
    try {
      const response = await apiService.get(`${replyCommentV1Url}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const getRepliesByCommentThreadId = async (commentThreadId: string) => {
    try {
      const response = await apiService.get(
        `${replyCommentV1Url}${commentThreadId}/thread`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const saveReplyComment = async (data: any) => {
    try {
      const response = await apiService.post(
        `${replyCommentV1Url}reply-thread`,
        data
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return {
    getRepliesByCommentId,
    getAllReplies,
    getRepliesByCommentThreadId,
    saveReplyComment,
  };
};
