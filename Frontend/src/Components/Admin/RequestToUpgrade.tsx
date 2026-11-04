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
import { GetListArtistForm } from "../../API/AdminAPI/GET.tsx";
import { AcceptToUpgrade } from "../../API/AdminAPI/PUT.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { RefuseToUpgrade } from "../../API/AdminAPI/DELETE.tsx";
import moment from "moment";
import { AdminGetAPI } from "../../API/AdminAPI/GET.tsx";
import { AdminPutAPI } from "../../API/AdminAPI/PUT.tsx";
import { useRankPostAPI } from "../../API/PackageAPI/POST.tsx";
import { ArtisForm } from "../../Interfaces/ArtisFormInterface.ts";

export default function RequestToUpgrade() {
  const [forms, setForms] = useState<ArtisForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{
    action: "accept" | "refuse";
    formId: string;
    userId: string;
  } | null>(null);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    open: boolean;
    description: string;
  }>({ open: false, description: "" });
  const navigate = useNavigate();
  const { getAllArtisForm } = AdminGetAPI();
  const { updateStatusArtisForm } = AdminPutAPI();
  const { upgradeToArtist } = useRankPostAPI();
  const fetchFormsWithUserInfo = async () => {

    try {
      const formList = await getAllArtisForm();
      setForms(formList.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormsWithUserInfo();
  }, []);

  const handleUserClick = (accountId: number) => {
    navigate(`/characters/profile/${accountId}`);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      if (confirmAction.action === "accept") {
        await updateStatusArtisForm(confirmAction.formId, true);
        await upgradeToArtist(confirmAction.userId);
      } else {
        await updateStatusArtisForm(confirmAction.formId, false);
      }
      await fetchFormsWithUserInfo();
    } catch (error) {
      throw error;
    }
    setConfirmAction(null);
  };

  const handleViewDescription = (description: string) => {
    setDescriptionDialog({ open: true, description });
  };

  return (
    <Container style={{ marginLeft: "300px" }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: "bold", marginTop: "40px" }}>
        Artist Upgrade Requests
      </Typography>

      <TableContainer component={Paper} style={{ marginBottom: "50px", marginTop: "40px" }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#0b81ff" }}>
              <TableCell style={{ color: "white" }}>
                <strong>Form ID</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>User Name</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Date Create</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Description</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Status</strong>
              </TableCell>
              <TableCell style={{ color: "white" }}>
                <strong>Behavior</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form._id}>
                <TableCell>{form._id}</TableCell>
                <TableCell>
                  <Box
                    onClick={() => handleUserClick(form.userId?._id!)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}>
                    <Avatar src={form.userId.profilePicture} />
                    {(() => {
                      const last = form.userId.lastName || "";
                      const first = form.userId.firstName || "";
                      const fullName = `${last} ${first}`.trim();
                      return fullName || "Unknown User";
                    })()}
                  </Box>
                </TableCell>
                <TableCell>{moment(form.dateCreation).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleViewDescription(form.description)}>
                    View Description
                  </Button>
                </TableCell>
                <TableCell>
                  {form.status === null ? (
                    <Typography color="danger.main">Pending</Typography>
                  ) : (
                    form.status === true ? (
                      <Typography color="success.main">Processed</Typography>
                    ) :
                      <Typography color="warning.main">Refused</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                    <Button
                      variant="contained"
                      color="success"
                      disabled={form.status !== null}
                      onClick={() => setConfirmAction({ action: "accept", formId: form._id!, userId: String(form.userId._id) })}>
                      Accept To Upgrade
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={form.status !== null}
                      onClick={() => setConfirmAction({ action: "refuse", formId: form._id!, userId: String(form.userId._id) })}>
                      Refuse To Upgrade
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!confirmAction} onClose={() => setConfirmAction(null)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmAction?.action === "accept" ? "accept" : "refuse"} this upgrade request?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmAction(null)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained" color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Description Dialog */}
      <Dialog open={descriptionDialog.open} onClose={() => setDescriptionDialog({ open: false, description: "" })}>
        <DialogTitle>Description</DialogTitle>
        <DialogContent>
          <Typography>{descriptionDialog.description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDescriptionDialog({ open: false, description: "" })} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
