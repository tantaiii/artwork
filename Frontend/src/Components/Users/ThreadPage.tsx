import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Avatar, CircularProgress } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import "../../css/Thread.css";
import LikeIconThread from "../LikeIconThread.jsx";
import CommentsThread from "../CommentsThread.jsx";

import { User } from "../../Interfaces/UserInterface.ts";
import { TypeOfTopic, Topic, Thread } from "../../Interfaces/ForumInterfaces.ts";
import { useAuth } from "../../secure/AuthContext.tsx";
import { ForumGetAPI } from "../../API/ForumAPI/GET.tsx";

const getTimeDifference = (utcDateString: string): string => {
  try {
    const utcDate = new Date(utcDateString); // Parse UTC
    if (isNaN(utcDate.getTime())) return "N/A";

    const now = new Date(); // Local now
    const diffInSeconds = Math.floor((now.getTime() - utcDate.getTime()) / 1000);

    if (diffInSeconds < 0) return "Future post";
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  } catch (error) {
    return "N/A";
  }
};

const ThreadPage = () => {
  const { theme } = useContext(ThemeContext);
  const { topicID, threadId } = useParams<{ topicID: string; threadId: string }>();
  const { user: authUser } = useAuth();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const forumApiRef = useRef<ReturnType<typeof ForumGetAPI> | null>(null);
  if (!forumApiRef.current) {
    forumApiRef.current = ForumGetAPI();
  }
  const { getThreadById } = forumApiRef.current;

  useEffect(() => {
    const loadThread = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!threadId) {
          throw new Error("Thread ID is required");
        }

        const threadData = await getThreadById(threadId);
        if (!threadData) {
          throw new Error("Thread not found");
        }

        setThread(threadData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while loading the thread");
      } finally {
        setLoading(false);
      }
    };

    loadThread();
  }, [threadId, getThreadById]);

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <CircularProgress sx={{ color: theme.color }} />
      </Box>
    );
  }

  if (error || !thread) {
    return (
      <Box
        sx={{
          backgroundColor: theme.backgroundColor,
          minHeight: "100vh",
          p: 3,
        }}>
        <Typography variant="h4" sx={{ color: theme.color }}>
          {error || "Thread not found"}
        </Typography>
      </Box>
    );
  }

  const user = thread.userId as User | null; // Populated from backend
  const authorName = user ? `${user.firstName} ${user.lastName}`.trim() : "Unknown";

  return (
    <Box sx={{ backgroundColor: theme.backgroundImage, position: "relative", minHeight: "100vh", p: 3 }}>
      <Box className="thread-page-container" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
        <div className="thread-header">
          <Typography className="thread-title" sx={{ color: theme.color }}>
            {thread.titleThread}
          </Typography>
          <div className="thread-metadata">
            <Typography sx={{ color: theme.color }}>{getTimeDifference(thread.dateCreated)}</Typography>
          </div>
        </div>

        <div className="thread-creator-section">
          <Avatar src={user?.profilePicture || "/images/anon.jpg"} className="thread-creator-avatar" />
          <div className="thread-creator-info">
            <Typography className="thread-creator-name" sx={{ color: theme.color }}>
              {authorName}
            </Typography>
            <Typography className="thread-content" sx={{ color: theme.color }}>
              {thread.threadDescription}
            </Typography>
          </div>
        </div>

        <div className="thread-stats">
          <div className="thread-stat-item">
            <LikeIconThread threadID={thread._id} />
          </div>
          <div className="thread-stat-item">
            <Typography className="thread-stat-label" sx={{ color: theme.color }}>
              Comments
            </Typography>
            <Typography className="thread-stat-value" sx={{ color: theme.color }}>
              {thread.comments}
            </Typography>
          </div>
        </div>

        <Box sx={{ mt: 4 }}>
          <CommentsThread threadId={thread._id} topicId={topicID || ""} />
        </Box>
      </Box>
    </Box>
  );
};

export default ThreadPage;
