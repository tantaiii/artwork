import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Grid, Avatar, Button } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import ThreadUpload from "./ThreadUpload.tsx";
import "../../css/Forum.css";

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

interface ThreadCardProps {
  thread: Thread;
  topicId: string;
}

const ThreadCard = ({ thread, topicId }: ThreadCardProps) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const user = thread.userId as User | null; // Populated from backend

  const authorName = user ? `${user.firstName} ${user.lastName}`.trim() : "Unknown";

  return (
    <Card
      onClick={() => navigate(`/characters/forum/${topicId}/${thread._id}`)}
      className="thread-card"
      sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
      <CardContent className="thread-content">
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <div className="thread-main-content">
              <Typography className="thread-title" sx={{ color: theme.color }}>
                {thread.titleThread}
              </Typography>
              <Typography className="thread-description" sx={{ color: theme.color }}>
                {thread.threadDescription}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={2}>
            <Typography className="thread-stats" sx={{ color: theme.color }}>
              {thread.comments} replies
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <div className="thread-author">
              <Avatar src={user?.profilePicture} className="thread-author-avatar" />
              <div className="thread-author-info">
                <Typography className="thread-author-name" sx={{ color: theme.color }}>
                  {authorName}
                </Typography>
                <Typography className="thread-time" sx={{ color: theme.color }}>
                  {getTimeDifference(thread.dateCreated)}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ThreadList = () => {
  const { theme } = useContext(ThemeContext);
  const { topicID } = useParams<{ topicID: string }>(); // Fix: topicID (capital I) để match navigate từ Forum page
  const { user: authUser } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const forumApiRef = useRef<ReturnType<typeof ForumGetAPI> | null>(null);
  if (!forumApiRef.current) {
    forumApiRef.current = ForumGetAPI();
  }
  const { getThreadsByTopicId, getTopicById } = forumApiRef.current;

  useEffect(() => {
    const loadData = async () => {
      if (!topicID) return; // Fix: topicID thay topicId
      try {
        // Fetch topic
        const topicData = await getTopicById(topicID);
        if (topicData) {
          setTopic(topicData);
        }

        // Fetch threads (populated userId)
        const threadsData = await getThreadsByTopicId(topicID);
        if (threadsData && Array.isArray(threadsData)) {
          setThreads(threadsData);
        }
      } catch (error) {
        setThreads([]);
      }
    };

    loadData();
  }, [topicID, getTopicById, getThreadsByTopicId]);

  const refreshThreads = async () => {
    if (!topicID) return;
    try {
      const threadsData = await getThreadsByTopicId(topicID);
      if (threadsData && Array.isArray(threadsData)) {
        setThreads(threadsData);
      }
    } catch (error) {}
  };

  if (!topicID) {
    // Fix: topicID
    return (
      <Box sx={{ backgroundColor: theme.backgroundColor }} className="empty-state">
        <Typography variant="h4" sx={{ color: theme.color }}>
          Topic not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="forum-container" sx={{ backgroundColor: theme.backgroundImage }}>
      <img src="/images/ForumBanner.png" alt="banner" className="forum-banner" />
      <Box className="forum-content" sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}>
        <div className="thread-header">
          <Typography variant="h4" className="thread-title" sx={{ color: theme.color }}>
            {topic?.title || `Topic ${topicID}`}
          </Typography>
          {authUser ? (
            <Button
              variant="contained"
              onClick={() => setIsUploadOpen(true)}
              className="create-thread-btn"
              sx={{
                backgroundColor: theme.color,
                color: theme.backgroundColor,
                "&:hover": {
                  backgroundColor: theme.color,
                  opacity: 0.9,
                },
              }}>
              Create Thread
            </Button>
          ) : (
            <Typography sx={{ color: theme.color, opacity: 0.7 }}>Please log in to create threads</Typography>
          )}
        </div>

        <ThreadUpload
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          refreshThreads={refreshThreads}
          topicId={topicID} // Pass topicID
        />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={7}>
            <Typography variant="subtitle1" sx={{ color: theme.color }}>
              Thread
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle1" sx={{ color: theme.color, textAlign: "center" }}>
              Replies
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1" sx={{ color: theme.color }}>
              Author
            </Typography>
          </Grid>
        </Grid>

        <div className="thread-list-container">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                thread={thread}
                topicId={topicID} // Pass topicID
              />
            ))
          ) : (
            <Typography className="empty-state" sx={{ color: theme.color }}>
              No threads found for this topic
            </Typography>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default ThreadList;
