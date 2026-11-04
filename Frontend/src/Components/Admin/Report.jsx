import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tab,
  Tabs,
  Paper,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { ReportPutAPI } from "../../API/ReportAPI/PUT.tsx";
import { ReportGetAPI } from "../../API/ReportAPI/GET.tsx";
import { AdminPutAPI } from "../../API/AdminAPI/PUT.tsx";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} role="tabpanel" id={`report-tabpanel-${index}`}>
      {value === index && children}
    </div>
  );
}

export default function Report() {
  const [unfinishedReports, setUnfinishedReports] = useState([]);
  const [finishedReports, setFinishedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();

  const { changeStatusReportToReviewed: UpdateReportStatus } = ReportPutAPI();
  const { getAllReportsPending, getAllReportsReviewed, getReportById: GetReportById } = ReportGetAPI();
  const { lockUserAccount: LockAccount, unlockUserAccount: UnlockAccount, updateArtworkStatus } = AdminPutAPI();

  const fetchReportsWithUserInfo = async () => {
    setLoading(true);
    try {
      const [unfinishedData, finishedData] = await Promise.all([getAllReportsPending(), getAllReportsReviewed()]);

      const processReports = async (reports) => {
        return (reports || []).map((report) => {
          const reporterInfo = report.reporterID || report.reporterInfo || null;
          const reportedInfo = report.reportedID || report.reportedInfo || null;
          const reportedArtwork = report.reportedArtworkID || report.reportedArtworkID || null;
          return {
            ...report,
            reporterInfo,
            reportedInfo,
            reportedArtworkID: reportedArtwork,

            artworkStatus: reportedArtwork?.status ?? undefined,
            statusUserActive: typeof reportedInfo?.isActive !== "undefined" ? reportedInfo.isActive : null,
          };
        });
      };

      const unfinishedWithUsers = await processReports(unfinishedData);
      const finishedWithUsers = await processReports(finishedData);

      setUnfinishedReports(unfinishedWithUsers);
      setFinishedReports(finishedWithUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsWithUserInfo();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserClick = (accountId) => {
    window.open(`/characters/profile/${accountId}`);
  };

  const handleArtworkClick = (artworkId) => {
    window.open(`/characters/artwork/${artworkId}`);
  };

  const showConfirmDialog = (action, params) => {
    setConfirmAction({ action, params });
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction.action) {
        case "lock":
          await LockAccount(confirmAction.params.accountId);
          break;
        case "unlock":
          await UnlockAccount(confirmAction.params.accountId);
          break;
        case "toggleArtwork": {
          const { artworkId, artworkStatus } = confirmAction.params;

          const statusNum = Number(artworkStatus);
          let newStatus;
          if (!isNaN(statusNum)) {
            newStatus = String(statusNum === 0 ? "1" : "0");
          } else {
            newStatus = undefined;
          }
          await updateArtworkStatus(artworkId, newStatus);
          break;
        }
        case "complete":
          await UpdateReportStatus(confirmAction.params.reportId);
          break;
      }
      await fetchReportsWithUserInfo();
    } catch (error) {}
    setDialogOpen(false);
    setConfirmAction(null);
  };

  const renderReportTable = (reports) => (
    <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <TableCell style={{ color: "white" }}>
              <strong>Reporter</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Reported</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Artwork</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Create Date</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Description</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Behavior</strong>
            </TableCell>
            <TableCell style={{ color: "white" }}>
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => {
            const reporter = report.reporterInfo || report.reporterID;
            const reported = report.reportedInfo || report.reportedID;
            const artwork = report.reportedArtworkID || report.reportedArtwork;
            const isPending =
              String(report.status).toLowerCase() === "pending" || report.status === 0 || report.status === "0";
            return (
              <TableRow key={report._id || report.reportId}>
                <TableCell>
                  <Box
                    onClick={() => handleUserClick(reporter?._id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    <Avatar src={reporter?.profilePicture} />
                    {(reporter?.firstName || "") + " " + (reporter?.lastName || "")}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    onClick={() => handleUserClick(reported?._id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    <Avatar src={reported?.profilePicture} />
                    {(reported?.firstName || "") + " " + (reported?.lastName || "")}
                  </Box>
                </TableCell>
                <TableCell>
                  {artwork && (artwork._id || artwork) && (
                    <Box
                      onClick={() => handleArtworkClick(artwork._id || artwork)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                      }}>
                      <Avatar
                        src={artwork.imageFile?.preview || artwork.imageFile?.image || ""}
                        variant="square"
                        sx={{ width: 56, height: 56 }}
                      />
                      <Typography>{artwork.artworkName || artwork._id || artwork}</Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>{moment(report.createdDate || report.createdAt).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    {typeof reported?.isActive !== "undefined" ? (
                      reported.isActive ? (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => showConfirmDialog("lock", { accountId: reported._id })}>
                          Lock Account
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => showConfirmDialog("unlock", { accountId: reported._id })}>
                          Unlock Account
                        </Button>
                      )
                    ) : null}
                    {artwork && (artwork._id || artwork) && (
                      <Button
                        variant="contained"
                        onClick={() =>
                          showConfirmDialog("toggleArtwork", {
                            artworkId: artwork._id || artwork,
                            artworkStatus: artwork.status,
                          })
                        }>
                        {String(artwork?.status) === "0" ? "UnHide Artwork" : "Hide Artwork"}
                      </Button>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {isPending ? (
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => showConfirmDialog("complete", { reportId: report._id || report.reportId })}
                      sx={{
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "warning.light",
                        },
                      }}>
                      Pending
                    </Button>
                  ) : (
                    <Box
                      sx={{
                        bgcolor: "success.light",
                        color: "success.dark",
                        p: 1,
                        borderRadius: 1,
                        textAlign: "center",
                        fontWeight: "bold",
                        boxShadow: 1,
                      }}>
                      Processed
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

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
        Reports Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Unfinished Reports" />
          <Tab label="Finished Reports" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderReportTable(unfinishedReports)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderReportTable(finishedReports)}
      </TabPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {confirmAction?.action === "complete"
            ? "complete this report"
            : confirmAction?.action === "lock"
            ? "lock this account"
            : confirmAction?.action === "unlock"
            ? "unlock this account"
            : confirmAction?.action === "toggleArtwork"
            ? confirmAction?.params?.artworkStatus === 0
              ? "show this artwork"
              : "hide this artwork"
            : "delete this artwork"}
          ?
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
