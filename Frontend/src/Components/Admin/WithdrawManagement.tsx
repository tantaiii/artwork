import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { AdminGetAPI } from "../../API/AdminAPI/GET.tsx";
import { AdminPutAPI } from "../../API/AdminAPI/PUT.tsx";
import { format } from "date-fns";
import { WithdrawInterface } from "../../Interfaces/WithdrawInterface.ts";
import { UserPutAPI } from "../../API/UserAPI/PUT.tsx";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function WithdrawManagement() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawInterface | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currencyMenuAnchor, setCurrencyMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "VND">("USD");
  const [withdraws, setWithdraws] = useState<WithdrawInterface[]>([]);
  const { getAllWithdraws } = AdminGetAPI();
  const { updateStatusWithdraw } = AdminPutAPI();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUserClick = (accountId: string) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleConfirmOpen = (withdraw: WithdrawInterface) => {
    setSelectedWithdraw(withdraw);
    setShowRejectInput(false);
    setRejectMessage("");
    setConfirmDialogOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmDialogOpen(false);
    setShowRejectInput(false);
    setRejectMessage("");
    setSelectedWithdraw(null);
  };

  const handleAcceptWithdraw = async () => {
    if (!selectedWithdraw?.user?._id) {
      alert("User data not loaded. Please refresh.");
      handleConfirmClose();
      return;
    }

    const userId = String(selectedWithdraw.user._id);
    const amount = Number(selectedWithdraw.amount);

    try {
      await updateStatusWithdraw(String(selectedWithdraw._id), "approved");
      fetchWithdraws();
    } catch (error: any) {
      alert("Failed: " + (error.message || "Unknown error"));
    } finally {
      handleConfirmClose();
    }
  };

  const handleRejectWithMessage = async () => {
    if (selectedWithdraw && rejectMessage.trim()) {
      try {
        await updateStatusWithdraw(String(selectedWithdraw._id), "rejected", rejectMessage);
        fetchWithdraws();
      } catch (error) {
      }
    }
    handleConfirmClose();
  };

  const handleCurrencyClick = (event: React.MouseEvent<HTMLElement>) => {
    setCurrencyMenuAnchor(event.currentTarget);
  };

  const handleCurrencySelect = (currency: "USD" | "VND") => {
    setSelectedCurrency(currency);
    setCurrencyMenuAnchor(null);
  };

  const calculateNeedPay = (coinWithdraw: number, currency: "USD" | "VND"): string => {
    if (currency === "VND") {
      return `${(coinWithdraw * 25000).toLocaleString()} VND`;
    }
    return `$${(coinWithdraw * 25000 / 26302).toFixed(2)}`;
  };

  const sortByDate = (a: WithdrawInterface, b: WithdrawInterface) => {
    const dateA = new Date(a.dateRequested).getTime();
    const dateB = new Date(b.dateRequested).getTime();
    return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const fetchWithdraws = async () => {
    try {
      const withdraws = await getAllWithdraws();
      setWithdraws(withdraws);
    } catch (error) {
    }
  };

  const formatMoneyVnd = (amount: number): string => {
    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const renderWithdrawTable = (withdraws: WithdrawInterface[], tabIndex: number) => {
    const filteredWithdraws = withdraws.filter((w) => {
      if (tabIndex === 0) return w.status === "pending";
      if (tabIndex === 1) return w.status === "approved" || w.status === "rejected";
      return false;
    });

    if (filteredWithdraws.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography>
            {tabIndex === 0
              ? "There are no pending withdrawal requests."
              : "No withdrawal requests processed."}
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#0b81ff" }}>
              <TableCell style={{ color: "white" }}><strong>Withdraw ID</strong></TableCell>
              <TableCell style={{ color: "white" }}><strong>User</strong></TableCell>
              <TableCell onClick={toggleSortDirection} style={{ cursor: "pointer", color: "white" }}>
                <strong>Create Date {sortDirection === "asc" ? "⬆" : "⬇"}</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}><strong>Bank Name</strong></TableCell>
              <TableCell style={{ color: "white" }}><strong>Bank Number</strong></TableCell>
              <TableCell style={{ color: "white" }}><strong>Coin</strong></TableCell>
              <TableCell onClick={handleCurrencyClick} style={{ cursor: "pointer", color: "white" }}>
                <strong>Need Pay ({selectedCurrency})</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}><strong>Status</strong></TableCell>
              <TableCell style={{ color: "white" }}><strong>Message</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...filteredWithdraws].sort(sortByDate).map((withdraw) => (
              <TableRow key={withdraw._id}>
                <TableCell>{withdraw._id}</TableCell>
                <TableCell>
                  <Box
                    onClick={() => withdraw.user?._id && handleUserClick(withdraw.user._id.toString())}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Avatar src={withdraw.user?.profilePicture} />
                    <Typography>
                      {withdraw.user?.firstName} {withdraw.user?.lastName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{format(new Date(withdraw.dateRequested), "MM/dd/yyyy HH:mm")}</TableCell>
                <TableCell>{withdraw.bankName}</TableCell>
                <TableCell>{withdraw.bankNumber}</TableCell>
                <TableCell>${withdraw.amount}</TableCell>
                <TableCell>{calculateNeedPay(withdraw.amount, selectedCurrency)}</TableCell>
                <TableCell>
                  {withdraw.status === "pending" ? (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleConfirmOpen(withdraw)}
                      sx={{ minWidth: 100 }}
                    >
                      Pending
                    </Button>
                  ) : withdraw.status === "approved" ? (
                    <Box
                      sx={{
                        bgcolor: "success.light",
                        color: "success.dark",
                        p: 1,
                        borderRadius: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Processed
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        bgcolor: "error.light",
                        color: "dark",
                        p: 1,
                        borderRadius: 1,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Rejected
                    </Box>
                  )}
                </TableCell>
                <TableCell>{withdraw.message || "No Message"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ marginLeft: "300px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
        Withdraw Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pending Withdrawal Form" />
          <Tab label="Finished Withdrawal Form" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderWithdrawTable(withdraws, 0)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderWithdrawTable(withdraws, 1)}
      </TabPanel>

      {/* DIALOG XỬ LÝ ACCEPT / REJECT */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle><strong>Confirm Withdrawal Request Processing</strong></DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to <strong>Accpet</strong> or <strong>Reject</strong> this request?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            ID: <strong>{selectedWithdraw?._id}</strong> |
            Amount: <strong>{formatMoneyVnd(selectedWithdraw?.amount ? selectedWithdraw.amount * 25000 : 0)}</strong>
          </Typography>

          {showRejectInput && (
            <Box sx={{ mt: 2 }}>
              <TextField
                autoFocus
                fullWidth
                label="Reason for rejection"
                value={rejectMessage}
                onChange={(e) => setRejectMessage(e.target.value)}
                multiline
                rows={2}
                variant="outlined"
                placeholder="Enter reason..."
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          {showRejectInput ? (
            <>
              <Button onClick={handleConfirmClose}>Cancel</Button>
              <Button
                onClick={handleRejectWithMessage}
                variant="contained"
                color="error"
                disabled={!rejectMessage.trim()}
              >
                Submit
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setShowRejectInput(true)} color="error">
                Reject
              </Button>
              <Button onClick={handleAcceptWithdraw} variant="contained" color="success">
                Accept
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={currencyMenuAnchor}
        open={Boolean(currencyMenuAnchor)}
        onClose={() => setCurrencyMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleCurrencySelect("USD")}>USD</MenuItem>
        <MenuItem onClick={() => handleCurrencySelect("VND")}>VND</MenuItem>
      </Menu>
    </Box>
  );
}