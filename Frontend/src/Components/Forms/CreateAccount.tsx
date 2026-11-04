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
import LoadingScreen from "../LoadingScreens/LoadingScreenSpokes.jsx";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import CircularProgress from "@mui/material/CircularProgress";
import CheckIcon from "@mui/icons-material/Check";

import { User } from "../../Interfaces/UserInterface";
import { UserPostAPI } from "../../API/UserAPI/POST.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import { MailPostAPI } from "../../API/MailAPI/POST.tsx";

declare const process: any;

let response: any = null;

function deriveUserName(vals: any) {
  const fn = (vals.firstName || "").trim();
  const ln = (vals.lastName || "").trim();
  if (fn || ln) return (fn + ln).replace(/\s+/g, "").toLowerCase();
  const emailLocal = (vals.email || "").split("@")[0] || "user";
  return emailLocal;
}

function LoginAsGuest() {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <Grid item xs={12} sx={{ textAlign: "center", paddingBottom: "5%" }}>
        <Divider sx={{ "&::before, &::after": { backgroundColor: theme.color } }} variant="middle">
          <Typography variant="h6" sx={{ color: theme.color }}>
            Alternative
          </Typography>
        </Divider>
        <Link className="guestBtn" style={{ fontStyle: "italic", color: "grey" }} to={`/`}>
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
export default function CreateAccount() {
  const { createUserAccount } = UserPostAPI();
  const { getCheckExistEmail } = UserGetAPI();
  const { sendMail } = MailPostAPI();

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // Call this function when the form is submitted successfully
  const handleOpenSnackbar = () => {
    setOpen(true);
  };
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    // Ignore close events from clicking away
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    navigate("/");
  };

  const randomPicture = () => {
    const pictures = [
      "https://res.cloudinary.com/djprssm3o/image/upload/v1743701818/background/352d1352-e996-419a-999e-cf8978d98837.jpg",
    ];
    const randomIndex = Math.floor(Math.random() * pictures.length);
    return pictures[randomIndex];
  };

  // Account Creation Started Here!
  const { theme } = useContext(ThemeContext);
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      profilePicture: randomPicture(),
      backgroundPicture: "",
      allowCommission: true,
      biography: "",
      role: 2,
      lastName: "",
      firstName: "",
      phone: "",
      address: "",
      email: "",
      password: "",
    },

    onSubmit: (values) => {
      const userPayload: Partial<User> = {
        email: values.email,
        password: values.password,
        phoneNumber: values.phone,
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
        biography: values.biography,
        profilePicture: values.profilePicture,
        backgroundPicture: values.backgroundPicture,
        allowCommission: values.allowCommission,
      };

      const submit = async () => {
        try {
          setIsLoading(true);
          const createdUser = await createUserAccount(userPayload);
          setIsLoading(false);
          handleOpenSnackbar();
        } catch (err) {
          setIsLoading(false);
        }
      };
      submit();
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Are you sure this is a REAL email address?")
        .required("Hey! Where's the email, pal?")
        .max(255, "No no, there are no email longer than 255 characters"),
      password: Yup.string()
        .required("Password! Or we gonna steal your account.")
        .min(6, "Must be 6 characters or more")
        .max(255, "It's stronger than everything I known, my system also, max is 255 characters."),
      biography: Yup.string()
        .required("Tell the community something about yourself")
        .max(255, "Too much! How famous are you? We only support 255 characters."),
      phone: Yup.string()
        .required("Please contains your REAL phone to support all feature!")
        .min(8, "Must be at least 8 and no more than 20 numbers")
        .max(20, "Must be at least 8 and no more than 20 numbers")
        .matches(/^\d+$/, "That doesn't look like a phone number"),
      address: Yup.string().max(255, "@.@ Shipper will really pissed off by this, 255 characters please!"),
      firstName: Yup.string().max(255, "255 characters only, please!").required("Tell the community your first name!"),
      lastName: Yup.string().max(255, "255 characters only, please!").required("Tell the community your last name!"),
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
  const [emailDisabled, setEmailDisabled] = useState<boolean>(false);

  const handleSendCode = async () => {
    const emailValue = formik.values.email;

    if (emailValue) {
      const check = await getCheckExistEmail(emailValue);
      if (check === true) {
        alert("Email already exists!");
        setLoad(false);
        setActiveOTP(false);
        setOtpButton(true);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
      };

      // @ts-ignore
      if (otpButton) {
        setLoad(true);
        // sendMail nhận một chuỗi email và trả về token (string) hoặc null
        response = await sendMail(emailValue);
        setOtpButton(false);
        setLoad(false);
        if (response) {
          setEmailDisabled(true);
        } else {
          formik.setErrors({ email: "Failed to send OTP. Please try again." });
          setTimeout(() => {
            formik.setErrors({ email: "" });
          }, 2000);
        }
      } else {
        // sendMail trả về token string -> so sánh trực tiếp với otp
        if (String(response) === String(otp)) {
          setActiveOTP(true);
        } else {
          formik.setErrors({ email: "Wrong OTP!" });
          // Xóa lỗi sau 5 giây
          setTimeout(() => {
            formik.setErrors({ email: "" });
          }, 2000);
        }
      }
    } else {
      formik.setErrors({ email: "Email is required" });
      setTimeout(() => {
        formik.setErrors({ email: "" });
      }, 2000);
    }
  };

  return (
    <Background>
      {isLoading ? <LoadingScreen /> : ""}
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
            sx={{ backgroundColor: theme.backgroundColor, margin: "auto" }}>
            <form onSubmit={formik.handleSubmit}>
              <Grid className="formregister" container spacing={2}>
                <Grid item xs={12}>
                  <div className="header">
                    <Typography sx={{ color: theme.color }} variant="h4" component="h1" gutterBottom>
                      Register Account
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    fullWidth
                    disabled={emailDisabled}
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
                  <Button variant={activeOTP ? "contained" : "outlined"} fullWidth onClick={handleSendCode}>
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
                    label="Password"
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

                <Grid item xs={6}>
                  <CustomizedTextField
                    id="firstName"
                    label="First Name"
                    name="firstName"
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
                <Grid item xs={6}>
                  <CustomizedTextField
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="email"
                    fullWidth
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.lastName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.lastName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="phone"
                    label="Your Phone"
                    name="phone"
                    autoComplete="phone"
                    fullWidth
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.phone && (
                    <Typography variant="body2" color="red">
                      {formik.errors.phone}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <CustomizedTextField
                    id="address"
                    label="Address (Optional)"
                    name="address"
                    autoComplete="address"
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.address && (
                    <Typography variant="body2" color="red">
                      {formik.errors.address}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <CustomizedTextField
                    id="biography"
                    label="Biography"
                    name="biography"
                    autoComplete="biography"
                    fullWidth
                    multiline
                    rows={3}
                    value={formik.values.biography}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.biography && (
                    <Typography variant="body2" color="red">
                      {formik.errors.biography}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={open || !activeOTP}
                    variant="contained"
                    type="submit"
                    style={{ marginBottom: "20px" }}
                    fullWidth>
                    REGISTER
                  </Button>
                </Grid>
              </Grid>
              <LoginAsGuest />
            </form>
          </Box>
        </div>
      </div>

      <Snackbar open={open} autoHideDuration={1000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Your form has been submitted successfully!
        </Alert>
      </Snackbar>
    </Background>
  );
}
