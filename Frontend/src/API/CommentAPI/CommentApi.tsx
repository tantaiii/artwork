import { useApiService } from "../../service/api.tsx";

const commentV1Url = `v1/comments/`;

export const useCommentGetAPI = () => {
  const apiService = useApiService();

  const getCommentByArtworkId = async (id: string) => {
    try {
      const response = await apiService.get(`${commentV1Url}${id}`);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { getCommentByArtworkId };
};

export const useReplyCommentPostAPI = () => {
  const apiService = useApiService();
  const postReplyComment = async (replyComment: {
    commentId: string;
    replyDetail: string;
    userId: string;
  }) => {
    try {
      const response = await apiService.post(
        `${commentV1Url}${replyComment.commentId}/replyComments`,
        replyComment
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  };
  return { postReplyComment };
};
