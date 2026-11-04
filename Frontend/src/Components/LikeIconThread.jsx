import React, { useEffect, useState, useContext } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import { ThreadInteractGetAPI } from "../API/ForumAPI/GET.tsx";
import { ThreadInteractPOSTAPI } from "../API/ForumAPI/POST.tsx";
import { useAuth } from "../secure/AuthContext.tsx";

export default function LikeIconThread({ threadID }) {
  const { theme } = useContext(ThemeContext);
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { accessToken } = useAuth();

  const { getLikeStatus, getLikeCount } = ThreadInteractGetAPI();
  const { toggleLike } = ThreadInteractPOSTAPI();

  useEffect(() => {
    const fetchLikeData = async () => {
      if (!threadID) return;

      try {
        const countRes = await getLikeCount(threadID);
        setLikeCount(countRes?.data ?? 0);

        if (accessToken) {
          const statusRes = await getLikeStatus(threadID);
          setIsLikeClicked(statusRes?.data ?? false);
        } else {
          setIsLikeClicked(false);
        }
      } catch (err) {
        throw err
      }
    };

    fetchLikeData();
  }, [threadID, accessToken]);

  const handleLikeClick = async () => {
    if (!accessToken) {
      alert("Please log in to continue");
      return;
    }

    try {
      const res = await toggleLike(threadID);
      if (res?.data) {
        setIsLikeClicked(res.data.isLike);
        setLikeCount(res.data.likeCount);
      }
    } catch (err) {
      throw err
    }
  };

  return (
    <div className="hero">
      <div className="button-like" style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{ display: "flex" }}
          className={`btn btn-thumbup ${isLikeClicked ? "active" : ""}`}
          id="thumbUpBtn"
          onClick={handleLikeClick}
        >
          {isLikeClicked ? (
            <ThumbUpIcon sx={{ fontSize: 35 }} style={{ color: "#32edce" }} />
          ) : (
            <ThumbUpOffAltIcon
              sx={{ color: theme.color, backgroundColor: "none", fontSize: 35 }}
            />
          )}
          <span
            style={{
              marginLeft: "8px",
              color: isLikeClicked ? "#32edce" : theme.color,
              fontSize: "16px",
              display: "inline-block",
            }}
          >
            {likeCount}
          </span>
        </button>

        <h4
          style={{
            paddingTop: "13px",
            color: theme.color,
            marginLeft: "10px",
            fontSize: "18px",
          }}
        >
          {likeCount} likes
        </h4>
      </div>
    </div>
  );
}