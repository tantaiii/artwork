// src/Components/Admin/NavigationAd.jsx
import * as React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListItemButton from "@mui/material/ListItemButton";
import LogoutIcon from "@mui/icons-material/Logout";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link } from "react-router-dom";
import { generateAdminReport } from "./ExportPDF.tsx";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAuth } from "../../secure/AuthContext.tsx";

function AdminNavbar() {
  const { accessToken, isLoading, logout } = useAuth();
  const drawerWidth = 220;
  const [exporting, setExporting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleExport = async () => {
    if (isLoading) {
      setSnackbar({
        open: true,
        message: "Loading user...",
        severity: "warning",
      });
      return;
    }

    if (!accessToken) {
      setSnackbar({
        open: true,
        message: "Please login to export report",
        severity: "error",
      });
      return;
    }

    setExporting(true);
    try {
      await generateAdminReport(accessToken);
      setSnackbar({
        open: true,
        message: "Report opened!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message.includes("ready") ? "Please wait..." : "Failed",
        severity: "error",
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{ width: drawerWidth }}
        PaperProps={{ style: { width: drawerWidth } }}
      >
        <div
          style={{
            backgroundColor: "#121621",
            paddingTop: "50px",
            paddingBottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/sliderImages/icon_demo.png"
            alt="Logo"
            style={{ width: "120px" }}
          />
        </div>

        <List
          style={{
            backgroundColor: "#121621",
            height: "100%",
            color: "#fdfdff",
          }}
        >
          {/* Các ListItemButton giữ nguyên */}
          <Link to={`/admin`}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <HomeIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
          <Link to={`listuser`}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <PeopleIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </Link>
          <Link to={"report"}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <ErrorOutlineIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Reports" />
            </ListItemButton>
          </Link>
          <Link to={"withdraw-management"}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <AccountBalanceWalletIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Withdraw Management" />
            </ListItemButton>
          </Link>
          <Link to={"activity"}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <BarChartIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Activity On ArtHub" />
            </ListItemButton>
          </Link>
          <Link to={"request-upgrade"}>
            <ListItemButton sx={{ width: 220, ml: 1 }}>
              <ListItemIcon>
                <AutoAwesomeIcon style={{ color: "#fdfdff" }} />
              </ListItemIcon>
              <ListItemText primary="Request To Upgrade" />
            </ListItemButton>
          </Link>

          {/* EXPORT BUTTON */}
          <ListItemButton
            onClick={handleExport}
            disabled={exporting}
            sx={{ width: 220, ml: 1 }}
          >
            <ListItemIcon>
              <FileDownloadIcon style={{ color: "#fdfdff" }} />
            </ListItemIcon>
            <ListItemText
              primary={exporting ? "Generating..." : "Export Report"}
            />
          </ListItemButton>

          <ListItemButton onClick={logout} sx={{ width: 220, ml: 1 }}>
            <ListItemIcon>
              <LogoutIcon style={{ color: "#fdfdff" }} />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </List>
      </Drawer>

      <div style={{ flexGrow: 1, padding: 3 }}>{/* Main content */}</div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AdminNavbar;
