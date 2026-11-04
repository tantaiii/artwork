import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { useNavigate } from "react-router-dom";
import "../../css/Forum.css";

import { User } from "../../Interfaces/UserInterface.ts";
import { TypeOfTopic, Topic } from "../../Interfaces/ForumInterfaces.ts";
import { useAuth } from "../../secure/AuthContext.tsx";
import { ForumGetAPI } from "../../API/ForumAPI/GET.tsx";

const getTimeDifference = (utcDateString: string): string => {
  try {
    const utcDate = new Date(utcDateString); // Parse UTC
    if (isNaN(utcDate.getTime())) return "N/A";

    const now = new Date(); // Local now
    const diffInSeconds = Math.floor(
      (now.getTime() - utcDate.getTime()) / 1000
    );

    if (diffInSeconds < 0) return "Future post";
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  } catch (error) {
    return "N/A";
  }
};

type DisplayTopic = {
  topicID?: string;
  title?: string;
  description?: string;
  dateCreated?: string;
  userID?: string;
  totalThread?: number;
  latestThread?: {
    _id: string;
    titleThread: string;
    threadDescription: string;
    likes: number;
    comments: number;
    topicId: string;
    userId?: Partial<User>; // Populated user object
    dateCreated: string;
    __v: number;
  } | null;
} & Partial<Topic>;

interface TopicCardProps {
  topic: DisplayTopic;
  onClick: () => void;
}

const TopicCard = ({ topic, onClick }: TopicCardProps) => {
  const { theme } = useContext(ThemeContext);
  const latestThread = topic.latestThread;
  const latestUser = latestThread?.userId || null;

  const latestPosterName = (() => {
    if (!latestThread) return "No posts";
    const first = latestUser?.firstName ?? "";
    const last = latestUser?.lastName ?? "";
    const full = `${first} ${last}`.trim();
    return full.length ? full : "Unknown";
  })();

  const latestPostTime = latestThread
    ? getTimeDifference(latestThread.dateCreated)
    : "N/A";

  return (
    <Card
      onClick={onClick}
      className="topic-card"
      sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}
    >
      <CardContent className="topic-card-content">
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={5}>
            <Box>
              <Typography className="topic-title" sx={{ color: theme.color }}>
                {topic.title ?? topic.title ?? "No title"}
              </Typography>
              <Typography
                className="topic-description"
                sx={{ color: theme.color }}
              >
                {topic.description ?? topic.description ?? ""}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Typography className="topic-stats" sx={{ color: theme.color }}>
              {topic.totalThread ?? "-"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <div className="topic-author">
              <Avatar
                src={latestUser?.profilePicture}
                className="author-avatar"
                alt={latestPosterName}
              />
              <div className="author-info">
                <Typography className="author-name" sx={{ color: theme.color }}>
                  {latestPosterName}
                </Typography>
                <Typography className="post-time" sx={{ color: theme.color }}>
                  {latestPostTime}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

interface TypeSectionProps {
  type: TypeOfTopic;
}

const TypeSection = ({ type }: TypeSectionProps) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [topics, setTopics] = useState<DisplayTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const lastFetchedTypeIdRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  const forumApiRef = useRef<ReturnType<typeof ForumGetAPI> | null>(null);
  if (!forumApiRef.current) {
    forumApiRef.current = ForumGetAPI();
  }
  const { getTopicsByTypeIdWithInfo } = forumApiRef.current;

  useEffect(() => {
    let cancelled = false;

    const fetchTopicsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const rawTypeId = type?._id;
        if (rawTypeId === undefined || rawTypeId === null || rawTypeId === "") {
          setTopics([]);
          return;
        }

        const typeId = String(rawTypeId);

        if (isFetchingRef.current && lastFetchedTypeIdRef.current === typeId) {
          return;
        }

        isFetchingRef.current = true;
        lastFetchedTypeIdRef.current = typeId;

        if (!getTopicsByTypeIdWithInfo) {
          throw new Error(
            "getTopicsByTypeIdWithInfo method not found in ForumGetAPI"
          );
        }

        const response: any = await getTopicsByTypeIdWithInfo(typeId);
        const topicsData: any[] = Array.isArray(response)
          ? response
          : response?.data ?? [];

        if (cancelled || lastFetchedTypeIdRef.current !== typeId) {
          return;
        }

        if (topicsData?.length) {
          const mapped: DisplayTopic[] = topicsData.map((t: any) => {
            return {
              topicID: t._id,
              title: t.title ?? t.TitleTopic ?? t.Name ?? t.TopicName,
              description: t.description ?? t.Description ?? "",
              dateCreated: t.createdAt ?? t.dateCreated ?? undefined,
              userID: t.userID ?? t.UserID ?? t.user ?? undefined,
              totalThread: t.threadCount ?? t.totalThreads ?? 0,
              latestThread: t.latestThread ?? null,
              TopicID: t._id,
              TitleTopic: t.title ?? t.TitleTopic ?? t.Name,
              Description: t.description ?? t.Description,
              TypeID: t.typeId ?? t.TypeID ?? typeId,
            };
          });
          setTopics(mapped);
        } else {
          setTopics([]);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
        isFetchingRef.current = false;
      }
    };

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    debounceTimerRef.current = window.setTimeout(() => {
      fetchTopicsData();
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      cancelled = true;
    };
  }, [type._id, getTopicsByTypeIdWithInfo]);

  if (loading) {
    return (
      <Box
        className="forum-section"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <CircularProgress sx={{ color: theme.color }} />
        <Typography sx={{ ml: 2, color: theme.color }}>
          Loading topics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="forum-section">
        <Typography sx={{ color: "red", textAlign: "center" }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="forum-section">
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <Typography variant="h5" sx={{ color: theme.color }}>
            {type.TypeName}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="subtitle1" sx={{ color: theme.color }}>
            Threads
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="subtitle1" sx={{ color: theme.color }}>
            Latest Poster
          </Typography>
        </Grid>
      </Grid>
      {topics.length === 0 ? (
        <Typography sx={{ color: theme.color, textAlign: "center" }}>
          No topics available
        </Typography>
      ) : (
        topics.map((topic) => (
          <TopicCard
            key={topic.topicID ?? topic._id}
            topic={topic}
            onClick={() =>
              navigate(`/characters/forum/${topic.topicID ?? topic._id}`)
            }
          />
        ))
      )}
    </Box>
  );
};

const ForumPage = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [types, setTypes] = useState<TypeOfTopic[]>([]);

  const forumApiRef = useRef<ReturnType<typeof ForumGetAPI> | null>(null);
  if (!forumApiRef.current) {
    forumApiRef.current = ForumGetAPI();
  }
  const forumApi = forumApiRef.current;

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData: any = await forumApi.getTypesOfTopic();
        const payloadArray: any[] = Array.isArray(typesData)
          ? typesData
          : typesData && Array.isArray(typesData.data)
          ? typesData.data
          : [];

        if (payloadArray.length) {
          const mapped = payloadArray.map((t: any) => ({
            _id: t._id ?? t.typeID ?? t.TypeID,
            TypeName: t.TypeName ?? t.typeName ?? t.NameOfType,
          })) as TypeOfTopic[];
          setTypes(mapped);
        } else {
          setTypes([]);
        }
      } catch (error) {}
    };
    fetchTypes();
  }, [forumApi]);

  return (
    <Box
      className="forum-container"
      sx={{ backgroundColor: theme.backgroundImage }}
    >
      <img
        src="/images/ForumBanner.png"
        alt="banner"
        className="forum-banner"
      />
      <Box
        className="forum-content"
        sx={{ backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.8)` }}
      >
        {types.map((type, idx) => (
          <TypeSection
            key={`${type?._id ?? type?.TypeName ?? idx}`}
            type={type}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ForumPage;
