import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CustomizedButton from "./StyledMUI/CustomizedButton.tsx";
import CustomizedTextField from "./StyledMUI/CustomizedTextField.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../css/Comment.css";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useCommentGetAPI } from "../API/CommentAPI/CommentApi.tsx";
import { useCommentPostAPI } from "../API/ArtworkAPI/GET.tsx";
import { useReplyCommentGetAPI } from "../API/CommentAPI/ReplyCommentApi.tsx";
import { useReplyCommentPostAPI } from "../API/CommentAPI/CommentApi.tsx";
import { useAuth } from "../secure/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export default function Comments() {
  const [artworkID, setArtworkID] = useState(null);
  const [artworkState, setArtworkState] = useState(false);

  const [comments, setComments] = useState([]);
  const { getCommentByArtworkId } = useCommentGetAPI();

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setArtworkID(id);
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentByArtworkId(id);
        setComments(commentsData.data);
      } catch (error) {
        setComments([]);
      }
    };
    fetchComments();
  }, [artworkState]);

  const onComment = (newComment) =>
    setComments((prev) => [newComment, ...prev]);

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div
        className="comment-user-display"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div className="inputcomment" style={{ width: "45%" }}>
          <CommentInput
            onComment={onComment}
            artworkID={artworkID}
            setArtworkState={setArtworkState}
            artworkState={artworkState}
          />
        </div>
        <div
          className="comments-list"
          style={{
            width: "45%",
            maxHeight: "700px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          {comments.map((comment, index) => (
            <CommentItem
              key={index}
              comment={comment}
              setArtworkState={setArtworkState}
              artworkState={artworkState}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CommentItem = ({
  comment,
  getUserNameById,
  setArtworkState,
  artworkState,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyComments, setReplyComments] = useState([]);
  const { getRepliesByCommentId } = useReplyCommentGetAPI();
  const { postReplyComment } = useReplyCommentPostAPI();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesData = await getRepliesByCommentId(comment._id);
        setReplyComments(repliesData.data);
      } catch (error) {
        setReplyComments([]);
      }
    };
    fetchReplies();
  }, [comment._id]);

  const handleReplyComment = async () => {
    if (!user) {
      alert("You need to be logged in to reply comment.");
      return;
    }

    if (!newReply.trim()) {
      return;
    }

    try {
      const replyData = {
        commentId: comment._id,
        replyDetail: newReply,
      };

      const response = await postReplyComment(replyData);
      if (response?.data) {
        setReplyComments((prevReplies) => [
          {
            ...response.data,
            userId: user,
          },
          ...prevReplies,
        ]);
        setNewReply("");
        setIsReplying(false);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="comment-card glass-card">
      <div className="comment-content">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CommentUserDisplay user={comment.userId} size={35} />
          <Typography style={{ marginLeft: "50px" }}>
            {comment.commentDetail}
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            {comment.dateCreated
              ? new Date(comment.dateCreated)
                  .toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Ho_Chi_Minh",
                  })
                  .replace(" ", " ")
              : ""}
          </Typography>
        </div>
        {isReplying ? (
          <CustomizedButton
            variant="contained"
            size="small"
            onClick={() => setIsReplying(false)}
            className="reply-button"
          >
            Cancel
          </CustomizedButton>
        ) : (
          <CustomizedButton
            variant="contained"
            size="small"
            onClick={() => setIsReplying(true)}
            className="reply-button"
          >
            Reply
          </CustomizedButton>
        )}
      </div>
      <div className="replies">
        {isReplying && (
          <div className="reply-input">
            <CustomizedTextField
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Reply to this comment..."
            />
            <Button onClick={handleReplyComment} className="submit-button">
              Submit
            </Button>
          </div>
        )}

        {replyComments.map((reply, index) => (
          <div key={index} className="reply-card glass-card">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <CommentUserDisplay
                user={reply.userId}
                getUserNameById={getUserNameById}
                size={35}
              />
              <Typography style={{ marginLeft: "45px" }}>
                {reply.replyDetail}
              </Typography>
              <Typography style={{ fontSize: "12px" }}>
                {reply.dateCreated
                  ? new Date(reply.dateCreated)
                      .toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                      .replace(" ", " ")
                  : ""}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function CommentInput({ artworkID, setArtworkState, artworkState }) {
  const { postComment } = useCommentPostAPI();
  const navigate = useNavigate();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: { commentDetail: "" },
    validationSchema: Yup.object({
      commentDetail: Yup.string().required("Comment cannot be empty"),
    }),
    onSubmit: async (values) => {
      if (!user) {
        navigate("/");
        return;
      }

      try {
        await postComment({
          artworkId: artworkID,
          commentDetail: values.commentDetail,
          commentThreadId: "",
        });

        formik.resetForm();
        setArtworkState(!artworkState);
      } catch (error) {
        console.error("Error posting comment:", error);
      }
    },
  });

  return (
    <div className="comment-input-container">
      <form onSubmit={formik.handleSubmit}>
        <CustomizedTextField
          style={{ width: "100%" }}
          name="commentDetail"
          placeholder="Share your thoughts..."
          value={formik.values.commentDetail}
          onChange={formik.handleChange}
          error={
            formik.touched.commentDetail && Boolean(formik.errors.commentDetail)
          }
          helperText={
            formik.touched.commentDetail && formik.errors.commentDetail
          }
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1%",
          }}
        >
          <CustomizedButton
            variant="contained"
            type="submit"
            endIcon={<SendIcon />}
            className="submit-button"
          >
            Send
          </CustomizedButton>
        </div>
      </form>
    </div>
  );
}

const CommentUserDisplay = ({ user, size = 40 }) => {
  const name = `${user.lastName || ""}`.trim() || "Unknown";
  const avatar = user.profilePicture || "/images/anon.jpg";
  const accountId = user._id;

  const [comments, setComments] = useState([]);
  const { getCommentByArtworkId } = useCommentGetAPI();
  const [artworkID, setArtworkID] = useState(null);
  const [artworkState, setArtworkState] = useState(false);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setArtworkID(id);
    const fetchComments = async () => {
      try {
        const commentsData = await getCommentByArtworkId(id);
        setComments(commentsData.data);
      } catch (error) {
        setComments([]);
      }
    };
    fetchComments();
  }, [artworkState]);

  return (
    <div
      className="comment-header"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <Box sx={{ position: "relative" }}>
        <Link
          to={`/characters/profile/${accountId}`}
          style={{ textDecoration: "none" }}
        >
          <img
            src={avatar}
            alt="User avatar"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Link>
      </Box>
      <div>
        <Link
          to={`/characters/profile/${accountId}`}
          style={{ textDecoration: "none" }}
        >
          <Typography sx={{ color: "#FFFFFF", fontWeight: "Bold" }}>
            {name}
          </Typography>
        </Link>
      </div>
    </div>
  );
};
