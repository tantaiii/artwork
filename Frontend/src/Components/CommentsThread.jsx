import React, { useState, useEffect, useCallback } from "react";
import { GetCreatorByID } from "../API/UserAPI/GET.tsx";
import { GetCurrentPackageByAccountID } from "../API/PackageAPI/GET.tsx";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CustomizedButton from "./StyledMUI/CustomizedButton.tsx";
import CustomizedTextField from "./StyledMUI/CustomizedTextField.tsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../css/Comment.css"; // Import CSS file
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { RankEffect } from "./StyledMUI/RankEffect.tsx";
import { useAuth } from "../secure/AuthContext.tsx";
import { ForumGetAPI } from "../API/ForumAPI/GET.tsx";
import { ForumPostAPI } from "../API/ForumAPI/POST.tsx";
import { useReplyCommentGetAPI } from "../API/CommentAPI/ReplyCommentApi.tsx";
import { useReplyCommentPostAPI } from "../API/CommentAPI/CommentApi.tsx";
import { UserGetAPI } from "../API/UserAPI/GET.tsx";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [threadId, setThreadID] = useState(null);
  const [threadState, setThreadState] = useState(false);
  const { getAllCommentsByThreadId } = ForumGetAPI();

  useEffect(() => {
    // Get threadID from URL
    const pathParts = window.location.pathname.split("/");
    const id = pathParts[pathParts.length - 1];
    setThreadID(id); // Set the threadID
  }, []);

  useEffect(() => {
    if (!threadId) return;

    const fetchComments = async () => {
      try {
        const response = await getAllCommentsByThreadId(threadId);
        setComments(response.data || []);
      } catch (error) {
        setComments([]);
      }
    };

    fetchComments();
  }, [threadId, threadState]);

  return (
    <div className="comments-container">
      <h2>Comments</h2>
      <div className="inputcomment">
        <CommentInput
          threadID={threadId}
          setThreadState={setThreadState}
          threadState={threadState}
        />
      </div>
      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            threadID={threadId}
          />
        ))}
      </div>
    </div>
  );
}

const CommentItem = ({ comment, threadID }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [newReply, setNewReply] = useState("");
  const [replyComments, setReplyComments] = useState([]);
  const { getRepliesByCommentThreadId, saveReplyComment } =
    useReplyCommentGetAPI();
  const { user } = useAuth();

  useEffect(() => {
    const fetchReplies = async () => {
      if (!comment?._id) return;

      try {
        const response = await getRepliesByCommentThreadId(comment._id);
        setReplyComments(response.data || []);
      } catch (error) {
        setReplyComments([]);
      }
    };

    fetchReplies();
  }, [comment?._id]);

  const onReplyComment = async () => {
    if (!user) {
      alert("Please log in to continue...");
      return;
    }

    if (!newReply.trim()) {
      return;
    }

    const newReplyData = {
      commentThreadId: comment._id,
      replyDetail: newReply,
      dateCreated: new Date().toISOString(),
    };

    try {
      // Gửi phản hồi bình luận
      const response = await saveReplyComment(newReplyData); // Cập nhật danh sách phản hồi
      setReplyComments((prevReplies) => [response.data, ...prevReplies]);
      setNewReply("");
      setIsReplying(false);

      // // Cập nhật số lượng bình luận
      // await axios.put(
      //   `${process.env.REACT_APP_API_URL}/Forum/update-comment-count/${threadID}`
      // );
    } catch (error) {}
  };

  return (
    <div className="comment-card glass-card">
      <div className="comment-content">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CommentUser userID={comment.userId._id} />
          <Typography style={{ marginLeft: "50px" }}>
            {comment.commentDetail}
          </Typography>
          <Typography style={{ fontSize: "12px", marginLeft: "50px" }}>
            {comment.createdDate
              ? new Date(comment.createdDate)
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
            <Button onClick={onReplyComment} className="submit-button">
              Submit
            </Button>
          </div>
        )}
        {replyComments.map((reply) => (
          <div key={reply._id} className="reply-card glass-card">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <CommentUser userID={reply.replierId._id} size={35} />
              <Typography style={{ marginLeft: "45px" }}>
                {reply.replyDetail}
              </Typography>
              <Typography style={{ fontSize: "12px", marginLeft: "45px" }}>
                {reply.dateOfInteract
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

function CommentInput({ threadID, setThreadState, threadState }) {
  const { postComment } = ForumPostAPI();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      commentDetail: "",
    },
    validationSchema: Yup.object({
      commentDetail: Yup.string().required("Comment cannot be empty"),
    }),
    onSubmit: async (values) => {
      if (!user) {
        alert("Please log in to continue...");
        return;
      }

      const commentData = {
        commentDetail: values.commentDetail,
        threadId: threadID,
        createdDate: new Date().toISOString(),
      };

      try {
        // Gửi bình luận
        await postComment(commentData);

        // Cập nhật số lượng bình luận
        // await axios.put(
        //   `${process.env.REACT_APP_API_URL}/Forum/update-comment-count/${threadID}`
        // );

        // Reset form và refetch comments
        formik.resetForm();
        setThreadState(!threadState);
      } catch (error) {}
    },
  });

  return (
    <div className="comment-input-container">
      <form onSubmit={formik.handleSubmit}>
        <CustomizedTextField
          id="comment"
          style={{ width: "100%" }}
          name="commentDetail"
          value={formik.values.commentDetail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Share your thoughts..."
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

const CommentUser = ({ userID, size = 40 }) => {
  const { getUserByIdUrl } = UserGetAPI();
  const [userData, setUserData] = useState({
    name: "Loading...",
    avatar: "/images/anon.jpg",
    accountId: null,
    package: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const creator = await getUserByIdUrl(userID);
        if (creator) {
          // const userPackage = await GetCurrentPackageByAccountID(
          //   creator.accountId
          // );
          // console.log(
          //   "Raw user package data for userID",
          //   userID,
          //   ":",
          //   userPackage
          // ); // Debug log

          // if (userPackage && typeof userPackage.typeID !== "undefined") {
          //   const packageData = {
          //     typeID: Number(userPackage.typeID), // Đảm bảo typeID là số
          //   };
          //   console.log("Processed package data:", packageData); // Debug log processed data

          setUserData({
            name: `${creator.data.firstName || ""}  ${
              creator.data.lastName || ""
            }`,
            avatar: creator.data.profilePicture || "/images/anon.jpg",
            accountId: creator.data._id,
            // package: packageData,
          });
        } else {
          setUserData({
            name: "Unknown User",
            avatar: "/images/anon.jpg",
            accountId: null,
            package: null,
          });
        }
      } catch (error) {
        setUserData({
          name: "Unknown User",
          avatar: "/images/anon.jpg",
          accountId: null,
          package: null,
        });
      }
    };
    loadUser();
  }, [userID]);

  return (
    <div
      className="comment-header"
      style={{ display: "flex", alignItems: "center", gap: "10px" }}
    >
      <Box sx={{ position: "relative" }}>
        <Link
          to={
            userData.accountId
              ? `/characters/profile/${userData.accountId}`
              : "#"
          }
          style={{ textDecoration: "none" }}
        >
          <img
            src={userData.avatar}
            alt="User avatar"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Link>
        {userData.package?.typeID &&
          [2, 3, 4, 5].includes(Number(userData.package.typeID)) && (
            <RankEffect type={Number(userData.package.typeID)} />
          )}
      </Box>
      <div>
        <Link
          to={
            userData.accountId
              ? `/characters/profile/${userData.accountId}`
              : "#"
          }
          style={{ textDecoration: "none" }}
        >
          <Typography sx={{ color: "#FFFFFF", fontWeight: "Bold" }}>
            {userData.name}
          </Typography>
        </Link>
      </div>
    </div>
  );
};
