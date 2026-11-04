import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Paper,
  Avatar,
  CircularProgress,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";

import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { AdminGetAPI } from "../../API/AdminAPI/GET.tsx";
import { AdminPutAPI } from "../../API/AdminAPI/PUT.tsx";

export default function TableListUser() {
  const { getUserByIdUrl } = UserGetAPI();
  const { getAllUsers } = AdminGetAPI();
  const { lockUserAccount: lockAccountUrl, unlockUserAccount: unlockAccountUrl } = AdminPutAPI();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const fetchUsersWithInfo = async () => {
    setLoading(true);
    try {
      const rawList = await getAllUsers();
      let userList = Array.isArray(rawList) ? rawList : rawList?.data ?? rawList?.users ?? rawList?.items ?? [];
      if (!Array.isArray(userList)) {
        userList = [];
      }

      const usersWithInfo = await Promise.all(
        userList.map(async (user) => {
          try {
            const userId = user.userId ?? user._id ?? user.id ?? user.accountID;
            const raw = await getUserByIdUrl(userId);
            const userInfo = raw?.data ?? raw;

            return {
              ...user,
              userId: userId,
              firstName: userInfo?.firstName ?? user.firstName ?? "",
              lastName: userInfo?.lastName ?? user.lastName ?? "",
              profilePicture: userInfo?.profilePicture ?? user.profilePicture ?? "",
              lastLogin: userInfo?.lastLogin ?? user.lastLogin ?? "",
            };
          } catch (error) {
            return {
              ...user,
              userId: user.userId ?? user._id ?? user.id ?? user.accountID,
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
              profilePicture: user.profilePicture ?? "",
              lastLogin: user.lastLogin ?? "",
            };
          }
        })
      );

      setUsers(usersWithInfo);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithInfo();
  }, []);

  const handleUserClick = (userId) => {
    const idToUse = userId ?? "";
    const url = `${window.location.origin}/characters/profile/${encodeURIComponent(idToUse)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const showConfirmDialog = (action, params) => {
    setConfirmAction({ action, params });
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.action === "lock") {
        await lockAccountUrl(confirmAction.params.user);
      } else {
        await unlockAccountUrl(confirmAction.params.user);
      }
      await fetchUsersWithInfo();
    } catch (error) {}
    setDialogOpen(false);
    setConfirmAction(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container style={{ marginLeft: "300px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
        Users Management
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          marginBottom: "50px",
          marginTop: "40px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#0b81ff" }}>
              <TableCell style={{ color: "white" }}>
                <strong>ID</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>User Name</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Email</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Phone Number</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>LastLogin</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Behavior</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => {
              const userId = user.userId ?? user._id ?? user.id ?? user.accountID;
              const rowNumber = index + 1;
              return (
                <TableRow key={userId}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell>
                    <Box
                      onClick={() => handleUserClick(userId)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}>
                      <Avatar src={user.profilePicture || "/icons/AvatarIcon.png"} />
                      {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.userName || "Unknown"}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {user.isActive ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => showConfirmDialog("lock", { user: userId })}>
                          Lock Account
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => showConfirmDialog("unlock", { user: userId })}>
                          Unlock Account
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            {confirmAction?.action === "lock" ? (
              <strong>lock this user's account</strong>
            ) : (
              <strong>unlock this user's account</strong>
            )}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
