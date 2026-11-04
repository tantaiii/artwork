import React, { useState, useContext, useMemo, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import "../../css/Thread.css";

import { User } from "../../Interfaces/UserInterface.ts";
import { TypeOfTopic, Topic, Thread } from "../../Interfaces/ForumInterfaces.ts";
import { useAuth } from "../../secure/AuthContext.tsx";
import { ForumPostAPI } from "../../API/ForumAPI/POST.tsx";

interface ThreadUploadProps {
  open: boolean;
  onClose: () => void;
  topicId: string; // Changed to string for Mongo _id
  refreshThreads: () => void;
}

const ThreadUpload: React.FC<ThreadUploadProps> = ({ open, onClose, topicId, refreshThreads }) => {
  const { theme } = useContext(ThemeContext);
  const { user: authUser } = useAuth();
  const [titleThread, setTitleThread] = useState("");
  const [threadDescription, setThreadDescription] = useState("");

  const forumApiRef = useRef<ReturnType<typeof ForumPostAPI> | null>(null);
  if (!forumApiRef.current) {
    forumApiRef.current = ForumPostAPI();
  }
  const { UploadThread } = forumApiRef.current;

  const handleSubmit = async () => {
    try {
      if (!authUser) {
        alert("Please log in to create a thread");
        return;
      }

      if (!titleThread.trim() || !threadDescription.trim()) {
        alert("Please fill in all fields");
        return;
      }

      await UploadThread({
        titleThread,
        threadDescription,
        topicId,
        userId: authUser._id,
      } as any); // ← Cast as any to bypass type check; update API type for camelCase

      setTitleThread("");
      setThreadDescription("");
      refreshThreads();
      onClose();
    } catch (error) {
      alert("Failed to create thread. Please try again.");
    }
  };

  const handleClose = () => {
    setTitleThread("");
    setThreadDescription("");
    onClose();
  };

  const isSubmitDisabled = !titleThread.trim() || !threadDescription.trim() || !authUser;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="thread-dialog"
      PaperProps={{
        sx: {
          backgroundColor: theme.backgroundColor,
          background: `linear-gradient(145deg, ${theme.backgroundColor} 0%, ${theme.backgroundColor2} 100%)`,
          border: `1px solid ${theme.color}20`,
        },
      }}>
      <DialogTitle
        className="dialog-title"
        sx={{
          color: theme.color,
          borderBottom: `1px solid ${theme.color}20`,
        }}>
        Create New Thread
      </DialogTitle>
      <DialogContent className="dialog-content">
        <Box className="form-container">
          <div className="field-container">
            <TextField
              label="Title"
              value={titleThread}
              onChange={(e) => setTitleThread(e.target.value)}
              fullWidth
              disabled={!authUser} // Disable if not logged in
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: theme.color,
                  backgroundColor: theme.backgroundColor,
                  "& fieldset": { borderColor: `${theme.color}40` },
                  "&:hover fieldset": { borderColor: theme.color },
                  "&.Mui-focused fieldset": { borderColor: theme.color },
                },
                "& .MuiInputLabel-root": {
                  color: theme.color,
                  "&.Mui-focused": { color: theme.color },
                },
              }}
            />
          </div>
          <div className="field-container">
            <TextField
              label="Description"
              value={threadDescription}
              onChange={(e) => setThreadDescription(e.target.value)}
              multiline
              rows={6}
              fullWidth
              disabled={!authUser}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: theme.color,
                  backgroundColor: theme.backgroundColor,
                  "& fieldset": { borderColor: `${theme.color}40` },
                  "&:hover fieldset": { borderColor: theme.color },
                  "&.Mui-focused fieldset": { borderColor: theme.color },
                },
                "& .MuiInputLabel-root": {
                  color: theme.color,
                  "&.Mui-focused": { color: theme.color },
                },
              }}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          onClick={handleClose}
          className="cancel-button"
          sx={{
            color: theme.color,
            "&:hover": {
              backgroundColor: `${theme.color}20`,
            },
          }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitDisabled}
          className="submit-button"
          sx={{
            backgroundColor: theme.color,
            color: theme.backgroundColor,
            "&:hover": {
              backgroundColor: theme.color,
              opacity: 0.9,
            },
          }}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThreadUpload;
