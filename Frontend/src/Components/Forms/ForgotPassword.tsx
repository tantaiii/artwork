import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./FormCSS/CreateAccount.css";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Background from "../Themes/Background.jsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { MailPostAPI } from "../../API/MailAPI/POST.tsx";
import { UserPostAPI } from "../../API/UserAPI/POST.tsx";

function LoginAsGuest() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Grid item xs={12} sx={{ textAlign: "center", paddingBottom: "5%" }}>
        <Divider
          sx={{ "&::before, &::after": { backgroundColor: theme.color } }}
          variant="middle"
        >
          <Typography variant="h6" sx={{ color: theme.color }}>
            Alternative
          </Typography>
        </Divider>
        <Link
          className="guestBtn"
          style={{ fontStyle: "italic", color: "grey" }}
          to={`/`}
        >
          Already Have An Account? Login Here!
        </Link>
      </Grid>
    </>
  );
}
const switchCustomText = (
  <Typography color="error" sx={{ display: "flex" }}>
    Happy Working <FavoriteIcon color="error" />
  </Typography>
);
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [serverOtp, setServerOtp] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { getCheckExistEmail } = UserGetAPI();
  const { resetPassword } = UserPostAPI();
  const { sendMail } = MailPostAPI();
  // Call this function when the form is submitted successfully
  const handleOpenSnackbar = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // Ignore close events from clicking away
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    navigate("/");
  };
  // Account Creation Started Here!
  const { theme } = useContext(ThemeContext);
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      email: "",
      firstName: "",
      password: "",
    },

    onSubmit: (values) => {
      if (values.firstName !== values.password) {
        alert("New Password and Confirm Password are not the same!");
      } else {
        const PostAccount = async () => {
          try {
            resetPassword({ email: values.email, password: values.password });
            handleOpenSnackbar();
          } catch (err) {
            throw err;
          }
        };
        PostAccount();
      }
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Are you sure this is a REAL email address?")
        .required("Hey! Where's the email, pal?")
        .max(255, "No no, there are no email longer than 255 characters"),
      password: Yup.string()
        .required("Password! Or we gonna steal your account.")
        .min(6, "Must be 6 characters or more")
        .max(
          255,
          "It's stronger than everything I known, my system also, max is 255 characters."
        ),
      firstName: Yup.string()
        .required("Password! Or we gonna steal your account.")
        .min(6, "Must be 6 characters or more")
        .max(
          255,
          "It's stronger than everything I known, my system also, max is 255 characters."
        ),
    }),
  });

  //XỬ LÝ OTP
  const [otp, setOtp] = useState<string>("");
  const [activeOTP, setActiveOTP] = useState<boolean>(false);
  const [otpButton, setOtpButton] = useState<boolean>(true);

  // Hàm xử lý khi nhập vào ô TextField
  const handleOTPChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Chỉ cho phép nhập số và giới hạn tối đa 6 ký tự
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  // Hàm xử lý khi nút SEND CODE được bấm
  const [load, setLoad] = useState<boolean>(false);

  const handleSendCode = async () => {
    const emailSchema = Yup.string()
      .email("Are you sure this is a REAL email address?")
      .required("Hey! Where's the email, pal?")
      .max(250, "No no, there are no email longer than 250 characters");

    try {
      await emailSchema.validate(formik.values.email);
      const email = formik.values.email;
      if (email) {
        const checkEmail = (await getCheckExistEmail(email)) as boolean;
        if (checkEmail === false) {
          alert("Email not exists! please Register Account!");
          setLoad(false);
          setActiveOTP(false);
          setOtpButton(true);
          return;
        }

        if (otpButton) {
          setLoad(true);
          setServerOtp(await sendMail(email)); //GET OTP FROM SERVER
          setOtpButton(false);
          setLoad(false);
        } else {
          if (String(serverOtp) === String(otp)) {
            setActiveOTP(true);
          } else {
            formik.setErrors({ email: "Wrong OTP!" });
            setTimeout(() => {
              formik.setErrors({ email: "" });
            }, 2000);
          }
        }
      }
    } catch (err: any) {
      formik.setErrors({ email: err.errors });
      // Xóa lỗi sau 5 giây
      setTimeout(() => {
        formik.setErrors({ email: "" });
      }, 2000);
    }
  };

  return (
    <Background>
      <div className="createaccount">
        <div className="signupForm" style={{ marginTop: "2%" }}>
          <Box
            height={"auto"}
            width={"80%"}
            my={4}
            display="flex"
            alignItems="center"
            gap={4}
            p={2}
            sx={{ backgroundColor: theme.backgroundColor, margin: "auto" }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Grid className="formregister" container spacing={2}>
                <Grid item xs={12}>
                  <div className="header">
                    <Typography
                      sx={{ color: theme.color }}
                      variant="h4"
                      component="h1"
                      gutterBottom
                    >
                      Forgot Password
                    </Typography>
                  </div>
                </Grid>
                <Grid item sm={12}>
                  <CustomizedTextField
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    disabled={activeOTP}
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.email && (
                    <Typography variant="body2" color="red">
                      {formik.errors.email}
                    </Typography>
                  )}
                </Grid>

                {/* OTP */}

                <Grid item xs={2} container alignItems="center">
                  <CustomizedTextField
                    label="Email OTP"
                    variant="outlined"
                    value={otp}
                    onChange={handleOTPChange}
                    inputProps={{ maxLength: 6 }}
                  />
                </Grid>
                <Grid item xs={2} container alignItems="center">
                  <Button
                    variant={activeOTP ? "contained" : "outlined"}
                    fullWidth
                    onClick={handleSendCode}
                  >
                    {load ? (
                      <CircularProgress />
                    ) : activeOTP ? (
                      <CheckIcon />
                    ) : otpButton ? (
                      "SEND OTP TO EMAIL"
                    ) : (
                      "ACTIVE"
                    )}
                  </Button>
                </Grid>

                {/* END OF OTP HANDLE */}
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="passwword"
                    label="New Password"
                    name="password"
                    type="password"
                    autoComplete="password"
                    fullWidth
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.password && (
                    <Typography variant="body2" color="red">
                      {formik.errors.password}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <CustomizedTextField
                    id="firstName"
                    label="Confirm Password"
                    name="firstName"
                    type="password"
                    autoComplete="email"
                    fullWidth
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.firstName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.firstName}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button
                    disabled={open || !activeOTP}
                    variant="contained"
                    type="submit"
                    style={{ marginBottom: "20px" }}
                    fullWidth
                  >
                    ready to explore!
                  </Button>
                </Grid>
              </Grid>
              <LoginAsGuest />
            </form>
          </Box>
        </div>
      </div>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your form has been submitted successfully!
        </Alert>
      </Snackbar>
    </Background>
  );
}
