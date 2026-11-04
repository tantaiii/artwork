import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import ChatIcon from "@mui/icons-material/Chat";
import "../css/ChatButton.css";
import { Badge } from "@mui/material";
import { useChatGet } from "../API/ChatAPT/GET.tsx";
import { useChatPut } from "../API/ChatAPT/PUT.tsx";
import { Snackbar, Alert } from "@mui/material";
import { useAuth } from "../secure/AuthContext.tsx";
import { useSocket } from "../secure/SocketContext.tsx";

const ChatButton = () => {
  const { user } = useAuth();
  // Now 'auth' contains your authentication state or null if there's nothing saved
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info", // 'info', 'warning', 'error', 'success'
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [chatProfile, setChatProfile] = useState([]);
  const [chat, setChat] = useState([]);
  const [_read_chat, set_read_chat] = useState(0);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const { getChatSelf, getMessageSelf, getChatByMeAndOther } = useChatGet();
  const { markAsReadChat } = useChatPut();
  useEffect(() => {
    const _getChattingUser = async () => {
      try {
        const chat = await getChatSelf().then((res) => res.data);
        const profiles = chat.map((c) =>
          c.user1Id._id === user._id ? c.user2Id : c.user1Id
        );
        const message = await getMessageSelf().then((res) => res.data);
        set_read_chat(chat.filter((c) => c.status === 0).length);
        setMessages(message);
        setChatProfile(profiles);
        setChat(chat);
      } catch (err) {
        console.warn(err);
      }
    };

    _getChattingUser();
  }, [user]);

  useEffect(() => {
    set_read_chat(chat.filter((c) => c.status === 0).length);
    const profiles = chat.map((c) =>
      c.user1Id._id === user._id ? c.user2Id : c.user1Id
    );
    setChatProfile(profiles);
  }, [chat.length]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = async (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "NEW_CHAT":
          setChat((prev) => [...prev, data.chat]);
          break;
        case "UPDATE_CHAT":
          const updatedChat = data.chat;
          setChat((prev) => {
            const index = prev.findIndex(
              (chat) =>
                (chat.user1Id._id === updatedChat.user1Id._id &&
                  chat.user2Id._id === updatedChat.user2Id._id) ||
                (chat.user1Id._id === updatedChat.user2Id._id &&
                  chat.user2Id._id === updatedChat.user1Id._id)
            );
            if (index !== -1) {
              const newArr = [...prev];
              newArr[index] = updatedChat;
              return newArr;
            }
            return prev;
          });
          break;
        case "MESSAGE":
          const _mes = data.message;
          setMessages((prev) => [...prev, _mes]);
          setChat((prevChats) => {
            const index = prevChats.findIndex(
              (chat) =>
                (chat.user1Id._id === _mes.senderId &&
                  chat.user2Id._id === _mes.receiverId) ||
                (chat.user1Id._id === _mes.receiverId &&
                  chat.user2Id._id === _mes.senderId)
            );
            if (index !== -1) {
              const updatedChats = [...prevChats];
              updatedChats[index] = {
                ...updatedChats[index],
                status: 0,
              };
              return updatedChats;
            } else {
              fetchAndAddNewChat(_mes.senderId);
              return prevChats;
            }
          });
          break;
        default:
      }
    };
    const fetchAndAddNewChat = async (senderId) => {
      const res = await getChatByMeAndOther(senderId);
      const newChat = res.data;

      setChat((prev) => {
        const alreadyExist = prev.some(
          (chat) =>
            (chat.user1Id._id === newChat.user1Id._id &&
              chat.user2Id._id === newChat.user2Id._id) ||
            (chat.user1Id._id === newChat.user2Id._id &&
              chat.user2Id._id === newChat.user1Id._id)
        );
        if (alreadyExist) return prev;
        return [...prev, newChat];
      });
    };
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const toggleChat = () => {
    if (!user) {
      setSnack({
        open: true,
        message: "You need to login to access this feature!",
        severity: "warning",
      });
      return;
    } else if (chat.length === 0) {
      setSnack({
        open: true,
        message: "You don't have any chat!",
        severity: "info",
      });
      return;
    }

    markAsReadChat();
    setChat((prevChats) => prevChats.map((chat) => ({ ...chat, status: 1 })));
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="chat-button" onClick={toggleChat}>
        <Badge color="secondary" badgeContent={_read_chat}>
          <ChatIcon className="chat-icon" />
        </Badge>
      </div>

      {isOpen && user && chat.length && (
        <div
          className="chat-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("chat-modal-overlay")) {
              setIsOpen(false);
            }
          }}
        >
          <div className="chat-modal">
            <Chat
              onClose={() => setIsOpen(false)}
              chat={chat}
              chatProfile={chatProfile}
              message={messages}
              user={user}
              setMessage={setMessages}
            />
          </div>
        </div>
      )}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatButton;
