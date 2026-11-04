import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";

import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import MailIcon from "@mui/icons-material/Mail";
import { Creator, User } from "../../Interfaces/UserInterface.ts";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import { INotification } from "../../Interfaces/NotificationInterfaces.ts";
import { useAuth } from "../../secure/AuthContext.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { useSocket } from "../../secure/SocketContext.tsx";
import { UserPutAPI } from "../../API/UserAPI/PUT.tsx";
interface CustomizedDropdownProps {
  user: User | null;
  handleClickAsGuest: any;
}
function CustomizedNotificationDropDown({
  user,
  handleClickAsGuest,
}: CustomizedDropdownProps) {
  const { logout } = useAuth();
  const { socket } = useSocket();
  const { markAsReadNotificationByMe } = UserPutAPI();
  const { getNotificationByUserId } = UserGetAPI();
  const { theme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [newNotiCount, setNewNotiCount] = useState<number>(0);

  const handleClickDropdown = async (event: any) => {
    if (user === null) {
      handleClickAsGuest();
    } else {
      markAsReadNotificationByMe();
      setNewNotiCount(0);
      setAnchorEl(event.currentTarget);
      setOpen(!open);
    }
  };

  useEffect(() => {
    const _getNotificationsByUserId = async () => {
      try {
        const response = await getNotificationByUserId();
        if (!response || !response.data) return;

        setNewNotiCount(
          response.data.filter((notification: any) => notification.isRead === 0)
            .length
        );
        setNotifications(response.data);
      } catch (err) {}
    };
    _getNotificationsByUserId();
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data);
      console.log(data);
      switch (data.type) {
        case "FOLLOW":
          setNotifications((prev) => [data.notification, ...prev]);
          setNewNotiCount((prev) => prev + 1);
          break;
        case "FORCE_LOGOUT":
          logout();
          alert("Your account has been banned by Admin.");
          break;
        default:
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const CustomizedMenu = styled(Menu)(() => ({
    "& .MuiPaper-root": {
      backgroundColor: theme.backgroundColor,
      boxShadow: "0px 4px 20px rgba(77, 77, 77, 0.5)",
      color: theme.color,
      border: theme.borderColor,
    },
    "": {
      border: `1px, ${theme.color}`,
    },
  }));

  function DropdownContent() {
    return (
      <>
        {
          <List>
            {notifications.map((notification, index) => {
              return (
                <Link
                  to={`profile/${(notification.profileNotifyId as User)._id}`}
                  key={index}
                >
                  <ListItemButton key={index}>
                    <ListItemAvatar
                      key={(notification.profileNotifyId as User)._id}
                    >
                      <Avatar
                        alt="Profile Picture"
                        src={
                          (notification.profileNotifyId as User).profilePicture
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${user?.firstName ?? ""} ${
                        user?.lastName ?? ""
                      }`}
                      secondary={
                        notification.message?.startsWith("#3")
                          ? `${notification.message?.slice(2)} | ${
                              (notification.profileNotifyId as User)
                                .firstName ?? ""
                            } ${
                              (notification.profileNotifyId as User).lastName ??
                              ""
                            }`
                          : notification.message?.startsWith("#2")
                          ? `You just withdrew ${notification.amount}!`
                          : notification.message
                      }
                      primaryTypographyProps={{ sx: { color: theme.color } }}
                      secondaryTypographyProps={{ sx: { color: theme.color2 } }}
                    />
                  </ListItemButton>
                </Link>
              );
            })}
          </List>
        }
      </>
    );
  }

  function Dropdown() {
    return (
      <CustomizedMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClickDropdown}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "left", flexDirection: "column" }}
        >
          <DropdownContent />
        </Box>
      </CustomizedMenu>
    );
  }

  return (
    //HIỂN THỊ CÁI GÌ, SỐ LƯỢNG NOTFICATION CHƯA XEM
    <Box>
      <IconButton
        onClick={handleClickDropdown}
        aria-controls={open ? "account-menu" : ""}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "false"}
      >
        <Badge color="secondary" badgeContent={newNotiCount}>
          <MailIcon sx={{ width: 30, height: 30, color: theme.color }} />
        </Badge>
      </IconButton>
      {user === null ? <></> : <Dropdown />}
    </Box>
  );
}

export default CustomizedNotificationDropDown;
