import React, { useContext, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Link } from "react-router-dom";
import { User } from "../../Interfaces/UserInterface";
import { LightDarkSwitch } from "./CustomizedLightDarkSwitch.tsx";
import { CurrentPackage } from "../../Interfaces/Package.ts";
import WithdrawForm from "../Users/WithdrawForm.tsx";
import { RankEffect } from "./RankEffect.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";

interface CustomizedDropdownProps {
  user: User | null;
  handleClickAsGuest: any;
  pack: CurrentPackage | null;
}

export default function CustomizedDropdown({
  user,
  handleClickAsGuest,
  pack,
}: CustomizedDropdownProps) {
  const { theme, toggleTheme, dark } = useContext(ThemeContext);
  const { logout } = useAuth();

  const CustomizedMenu = styled(Menu)(() => ({
    "& .MuiPaper-root": {
      backgroundColor: theme.backgroundColor,
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
      color: theme.color,
      border: theme.borderColor,
    },
  }));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const handleClickDropdown = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      handleClickAsGuest();
    } else {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const DropdownContent = () => (
    <>
      <Divider
        sx={{ "&::before, &::after": { backgroundColor: theme.color } }}
        variant="middle"
      >
        <Typography variant="caption">Account</Typography>
      </Divider>
      <MenuItem>
        <Link
          to={`profile/${user?._id}`}
          style={{
            textDecoration: "none",
            color: theme.color,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          Profile
        </Link>
      </MenuItem>
      <MenuItem onClick={() => setWithdrawOpen(true)}>Withdraw</MenuItem>
      <Divider
        sx={{ "&::before, &::after": { backgroundColor: theme.color } }}
        variant="middle"
      >
        <Typography variant="caption">Theme</Typography>
      </Divider>
      <MenuItem>
        <LightDarkSwitch onClick={toggleTheme} checked={dark} />
      </MenuItem>
      {user?.role?.name === "Admin" && (
        <>
          <Divider
            sx={{ "&::before, &::after": { backgroundColor: theme.color } }}
            variant="middle"
          >
            <Typography variant="caption">Admin</Typography>
          </Divider>
          <MenuItem>
            <Link
              to="/admin"
              style={{
                textDecoration: "none",
                color: theme.color,
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              Admin Dashboard
            </Link>
          </MenuItem>
        </>
      )}
      <Divider sx={{ backgroundColor: theme.color }} variant="middle" />
      <MenuItem onClick={logout}>Logout</MenuItem>

      <Dialog
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.backgroundColor,
            color: theme.color,
            border: theme.borderColor,
          },
        }}
      >
        <WithdrawForm onClose={() => setWithdrawOpen(false)} />
      </Dialog>
    </>
  );

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <IconButton
        onClick={handleClickDropdown}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Avatar src={user?.profilePicture} sx={{ width: 40, height: 40 }}>
          {user?.profilePicture
            ? ""
            : ((user?.firstName?.[0] as string) || "") +
              ((user?.lastName?.[0] as string) || "")}
        </Avatar>

        {pack?.typeID && [2, 3, 4, 5].includes(pack.typeID) && (
          <RankEffect type={pack.typeID as 2 | 3 | 4 | 5} />
        )}
      </IconButton>
      {user && (
        <CustomizedMenu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <DropdownContent />
          </Box>
        </CustomizedMenu>
      )}
    </Box>
  );
}
