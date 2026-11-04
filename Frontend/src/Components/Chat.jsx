import React, { useState, useEffect, useRef, useContext } from "react";
import "../css/Chat.css";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import { ThemeContext } from "./Themes/ThemeProvider.tsx";
import {
  Avatar,
  Backdrop,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Grid,
  TextField,
} from "@mui/material";
import { useChatPost } from "../API/ChatAPT/POST.tsx";
import { saveNewMoneyTransfer } from "../API/PaymentAPI/POST.tsx";
import "../css/ArtConfirm.css";
import axios from "axios";

const getOTPURL = `${process.env.REACT_APP_API_URL}/Account/send-token`;
const Chat = ({ onClose, chat, chatProfile, message, user, setMessage }) => {
  const chatRef = useRef(null);
  const childDialogRef = useRef(null);

  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    if (!message || !chatProfile || !chatProfile[0]) {
      return [];
    }
    return message.filter(
      (msg) =>
        (msg.senderId === user._id || msg.receiverId === user._id) &&
        (msg.senderId === chatProfile[0]._id ||
          msg.receiverId === chatProfile[0]._id)
    );
  });
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewChat, setPreviewChat] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [previewInput, setPreviewInput] = useState(false);

  const [res, setRes] = useState(null);
  const [previewOtpInput, setPreviewOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { sendMessage } = useChatPost();
  // Cập nhật selectedUser dựa trên chatProfile
  useEffect(() => {
    if (chatProfile && chatProfile.length > 0) {
      setSelectedUser(chatProfile[0]);
    } else {
      setSelectedUser(null);
    }
  }, [chatProfile]);

  // Cập nhật messages khi message hoặc selectedUser thay đổi
  useEffect(() => {
    if (selectedUser && message) {
      setMessages(
        message.filter(
          (msg) =>
            (msg.senderId === user._id || msg.receiverId === user._id) &&
            (msg.senderId === selectedUser._id ||
              msg.receiverId === selectedUser._id)
        )
      );
    } else {
      setMessages([]);
    }
  }, [message, selectedUser, user]);

  // Cuộn xuống cuối danh sách tin nhắn
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Đóng chat khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        !(
          childDialogRef.current &&
          childDialogRef.current.contains(event.target)
        )
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    const newMsg = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage,
      dateSent: new Date(),
    };
    setMessage((prev) => [...prev, newMsg]);
    sendMessage(newMsg);
    setNewMessage("");
  };

  // Định dạng thời gian
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Đóng popover
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPreviewChat(null);
  };
  const openPopover = Boolean(anchorEl);

  // Chuyển đổi người dùng được chọn
  const handleSwitchSelectedUser = (user) => {
    setSelectedUser(user);
    setMessages(
      message
        ? message.filter(
            (msg) =>
              (msg.senderId === user._id || msg.receiverId === user._id) &&
              (msg.senderId === user._id || msg.receiverId === user._id)
          )
        : []
    );
  };

  // Xử lý hiển thị input coin
  const handlePreviewInputSendCoint = () => {
    setPreviewInput((prev) => !prev);
  };

  const handleSendCoin = async (e) => {
    e.preventDefault();
    const _inputCoin = newMessage;
    if (isNaN(_inputCoin)) {
      alert("This is not number!");
    } else {
      const _coin = Number(_inputCoin);
      if (_coin > user.coins) {
        alert("You don't have enough coins!");
      } else {
        try {
          setPreviewOtpInput(true);
          const headers = {
            "Content-Type": "application/json",
          };

          setLoading(true);
          const response = await axios.post(
            `${getOTPURL}`,
            { email: user.email },
            { headers }
          ); //GET OTP FROM SERVER
          setRes(response.data);
          setLoading(false);

          setPreviewInput((prev) => !prev);
        } catch (error) {
          console.error(error);
          alert("Transfer failed!");
        }
      }
    }
  };

  const handleSubmitOtp = async () => {
    const _otp = otp;
    if (_otp.toString().trim() === res.toString().trim()) {
      try {
        const _objectMoneyTransfer = {
          transferId: 0,
          sender_id: user._id,
          receiver_id: selectedUser._id,
          amount: Number(newMessage),
          transferDate: null,
        };
        const response = await saveNewMoneyTransfer(_objectMoneyTransfer);
        setDialogSuccess(true);

        setTimeout(() => {
          setDialogSuccess(false);
          setPreviewOtpInput(false);
          setOtp("");
        }, 2000);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Wrong OTP!");
    }
  };

  return (
    <Box
      ref={chatRef}
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "70%",
        height: "80%",
        boxShadow: 3,
        borderRadius: 2,
        color: theme.color,
        backgroundColor: theme.backgroundColor,
        display: "flex",
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Danh sách người dùng */}
      <Box sx={{ width: "200px", borderRight: "1px solid #ccc" }}>
        {chatProfile && chatProfile.length > 0 ? (
          <List>
            {chatProfile.map((user, index) => (
              <ListItem
                key={index}
                onClick={() => handleSwitchSelectedUser(user)}
                sx={{
                  border: "1px solid transparent",
                  "&:hover": {
                    borderColor: theme.backgroundColor3,
                    borderRadius: "20px",
                    color: theme.color2,
                    cursor: "pointer",
                  },
                  padding: 1,
                }}
              >
                <img
                  src={user.profilePicture}
                  alt={user.lastName}
                  className="user-avatar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2">
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Không có người dùng nào</Typography>
        )}
      </Box>

      {/* Giao diện chat */}
      {selectedUser ? (
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderBottom: "1px solid #ccc",
            }}
          >
            <img
              src={selectedUser.profilePicture}
              alt={selectedUser.lastName}
              className="user-avatar"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1">
                {selectedUser.firstName} {selectedUser.lastName}
              </Typography>
              <Typography variant="caption">
                Coins: {selectedUser.coins}
              </Typography>
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              <Button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 1,
              scrollBehavior: "smooth",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  textAlign: message.senderId === user._id ? "right" : "left",
                }}
              >
                <Box
                  sx={{
                    display: "inline-block",
                    p: 1,
                    bgcolor:
                      message.senderId === user._id
                        ? "primary.main"
                        : "grey.300",
                    color: message.senderId === user._id ? "white" : "black",
                    borderRadius: 1,
                    maxWidth: "80%",
                  }}
                >
                  {message.message}
                </Box>
                <Typography variant="caption" sx={{ marginLeft: "4.8px" }}>
                  {formatTimestamp(message.dateSent)}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            component="form"
            sx={{
              display: "flex",
              p: 1,
              borderTop: "1px solid #ccc",
            }}
            onSubmit={previewInput ? handleSendCoin : handleSendMessage}
          >
            <Chip
              avatar={
                <Avatar
                  alt="Coins"
                  src="/icons/coin.gif"
                  sx={{
                    bgcolor: "transparent",
                  }}
                />
              }
              onClick={handlePreviewInputSendCoint}
              label={previewInput ? "chat" : "send"}
              variant="outlined"
              sx={{
                "& .MuiChip-avatar": {
                  bgcolor: "transparent !important",
                },
                marginRight: "10px",
                "& .MuiChip-label": {
                  color: theme.color5,
                  fontWeight: "normal",
                  fontSize: "1rem",
                  transition: theme.transition,
                },
                transition: "padding 0.3s ease",
                "&:hover": {
                  padding: "3.2px",
                  cursor: "pointer",
                },
              }}
              color="secondary"
            />

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                previewInput ? "Input coins..." : "Input the message..."
              }
              style={{
                flexGrow: 1,
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                outline: "2px solid transparent",
                transition:
                  "outline 0.3s ease-in-out, border-color 0.3s ease-in-out",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = previewInput ? "#cd05f5" : "cyan";
                e.target.style.outline = previewInput
                  ? "2px solid #cd05f5"
                  : "2px solid cyan";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.outline = "2px solid transparent";
              }}
            />

            <Button
              type="submit"
              style={{
                marginLeft: "8px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                border: "none",
                background: "none",
              }}
            >
              <SendIcon
                sx={{
                  color: previewInput ? "#cd05f5" : "cyan",
                  transition: "0.3s ease-in-out, border-color 0.3s ease-in-out",
                }}
              />
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography>Không có cuộc trò chuyện nào được chọn</Typography>
      )}

      {/* Popover xem trước */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        disableRestoreFocus
      >
        <Typography sx={{ p: 2 }}>
          {previewChat ? previewChat.content : "Chưa có tin nhắn"}
        </Typography>
      </Popover>

      <Dialog
        ref={childDialogRef}
        open={previewOtpInput}
        aria-labelledby="success-dialog"
        className="dialog-custom"
      >
        <div
          className={
            dialogSuccess
              ? "success-dialog status-dialog"
              : "inputForm-dialog status-dialog"
          }
        >
          {dialogSuccess ? (
            <h2>Money trasnfer successfully!</h2>
          ) : (
            <>
              <h2>OTP sent to your email!</h2>
              <Grid>
                <TextField
                  id="outlined-basic"
                  label="Enter OTP"
                  variant="outlined"
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  InputLabelProps={{
                    style: { color: "white" },
                  }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white",
                      },
                      "&:hover fieldset": {
                        borderColor: "white",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white",
                      },
                      "& input::placeholder": {
                        color: "white",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                  }}
                />
              </Grid>
              <Grid>
                <Button
                  onClick={() => handleSubmitOtp()}
                  variant="outlined"
                  color="inherit"
                >
                  Send!
                </Button>
              </Grid>
            </>
          )}
        </div>
      </Dialog>
    </Box>
  );
};

export default Chat;
