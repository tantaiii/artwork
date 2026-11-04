import React, { useContext, useEffect, useState, useMemo } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Link, useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { RankEffect } from "../StyledMUI/RankEffect.tsx";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CakeIcon from "@mui/icons-material/Cake";
import RoomIcon from "@mui/icons-material/Room";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import PhoneIcon from "@mui/icons-material/Phone";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Avatar from "@mui/material/Avatar";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import {
  PutCreatorBackgroundPicture,
  PutCreatorProfilePicture,
  PutProfile,
} from "../../API/UserAPI/PUT.tsx";
import { UserPostAPI } from "../../API/UserAPI/POST.tsx";
import { UserDeleteAPI } from "../../API/UserAPI/DELETE.tsx";
import { UserPutAPI } from "../../API/UserAPI/PUT.tsx";

import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { PlaceHoldersImageCard } from "./PlaceHolders.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { parse } from "date-fns/parse";
import "../../css/ArtPost.css";
import "../../css/ProfileUser.css";
import ReportForm from "./UserForms/ReportForm.tsx";
import FavouritesArtwork from "./FavouritesArtwork.tsx";
import CommissionForm from "./CommissionForm.tsx";
import { Chat } from "../../Interfaces/ChatInterfaces.ts";
import { useChatPost } from "../../API/ChatAPT/POST.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import { Irole } from "../../Interfaces/RoleInterfaces.ts";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { User } from "../../Interfaces/UserInterface.ts";
import { ArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";

function CustomTabPanel(props: any) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProfileUser() {
  const [showCommissionForm, setShowCommissionForm] = useState(false);
  // USE API
  const { createChat } = useChatPost();
  const [isFollowing, setIsFollowing] = useState(false);
  const [snackbarFollow, setSnackBarFollow] = useState(false);
  const [snackbarFollowError, setSnackbarFollowError] = useState<string | null>(
    null
  );

  // CURRENT SESSION USER
  let { user, setUser } = useAuth();
  const { getUserByIdUrl, checkFollowing } = UserGetAPI();
  const { changePassword, putProfile } = UserPutAPI();
  const { followUser } = UserPostAPI();
  const { unfollowUser } = UserDeleteAPI();
  // CURRENT QUERY BY PARAMS
  const [currentUser, setCurrentUser] = useState<User>(user!);

  const [snackbarChangePassword, setSnackbarChangePassword] = useState(false);
  const [snackbarChangePasswordError, setSnackbarChangePasswordError] =
    useState(false);

  const snackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setSnackbarChangePassword(false);
    setSnackbarChangePasswordError(false);
    setSnackBarFollow(false);
    setSnackbarFollowError(null);
  };

  // Account Change Password Started Here!
  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("What? Don't remember the password?")
        .min(5, "Must be 5 characters or more"),
      password: Yup.string()
        .required("Password! Or we're gonna steal your account.")
        .min(5, "Must be 5 characters or more"),
      confirmPassword: Yup.string()
        .required("Goldfish? Type a new password again.")
        .min(5, "Must be 5 characters or more"),
    }),

    onSubmit: (values) => {
      if (values.confirmPassword !== values.password) {
        alert("New Password and Submit Password are not the same!");
      } else {
        let checkChangePassword: any;
        const ChangePass = async () => {
          try {
            checkChangePassword = await changePassword(
              values.oldPassword,
              values.password
            ).then((res: any) => res.data);
            if (String(checkChangePassword?.status) !== "error") {
              setSnackbarChangePassword(true);
            } else {
              setSnackbarChangePasswordError(true);
            }
          } catch (err) {
            if (String(checkChangePassword?.status) === "success")
              setSnackbarChangePasswordError(true);
          }
        };
        ChangePass();
      }
    },
  });
  // FORMAT DATA
  const timeAgo = (dateString: string) => {
    const now: any = new Date();
    const date: any = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin} minute(s) ago`;
    if (diffHr < 24) return `${diffHr} hour(s) ago`;
    if (diffDay === 1) return "Yesterday";
    if (diffDay < 7) return `${diffDay} day(s) ago`;
    if (diffDay < 30) return `${Math.floor(diffDay / 7)} week(s) ago`;
    if (diffDay < 365) return `${Math.floor(diffDay / 30)} month(s) ago`;
    return `${Math.floor(diffDay / 365)} year(s) ago`;
  };
  // |||||||||----END-CHANGE-PASSWORD----||||||||

  // EDIT PROFILE

  const F4k = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    initialValues: {
      firstName: user?.firstName,
      biography: user?.biography,
      address: user?.address,
      lastName: user?.lastName,
      date: user?.dateOfBirth,
      phoneNumber: user?.phoneNumber,
    },

    validationSchema: Yup.object({
      firstName: Yup.string().max(255, "255 characters only, please!"),
      lastName: Yup.string().max(255, "255 characters only, please!"),
      date: Yup.date()
        .transform(function (value, originalValue) {
          if (this.isType(value)) {
            return value;
          }
          const result = parse(originalValue, "dd/MM/yyyy", new Date());
          return result;
        })
        .typeError("please enter a valid date")
        .max(new Date().getFullYear(), "You can not born in the future!!"),

      address: Yup.string().max(
        255,
        "@.@ Shipper will really pissed off by this, 255 characters please!"
      ),
      biography: Yup.string()
        .required("Tell the community something about yourself")
        .max(
          255,
          "Too much! How famous are you? We only support 255 characters."
        ),
      phoneNumber: Yup.string()
        .required("Please contains your REAL phone to support all feature!")
        .min(8, "Must be at least 8 and no more than 20 numbers")
        .max(20, "Must be at least 8 and no more than 20 numbers")
        .matches(/^\d+$/, "That doesn't look like a phone number"),
    }),

    onSubmit: (values) => {
      let checkChangeProfile: any;
      const EditProfile = async () => {
        try {
          checkChangeProfile = await putProfile({
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.address,
            biography: values.biography,
            dateOfBirth: values.date,
            phoneNumber: values.phoneNumber,
          });
          setUser(checkChangeProfile.data);
          if (String(checkChangeProfile.status) === "success") {
            setSnackbarChangePassword(true);
          } else {
            setSnackbarChangePasswordError(true);
          }
        } catch (err) {
          if (checkChangeProfile === "error")
            setSnackbarChangePasswordError(true);
        }
      };
      EditProfile();
    },
  });
  // |||||||||----END-EDIT-PROFILE----|||||||||

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { getArtworksByUserId } = ArtworkGetAPI();
  const { getAvatarUser, getBackgroundUser } = UserGetAPI();
  const { PutCreatorAvaterPicture, PutCreatorBackgroundPicture } = UserPutAPI();
  const [previewProfile, setPreviewProfile] = useState<string>(
    "https://shorturl.at/c3o5s"
  );
  const [previewBackground, setPreviewBackground] = useState<string>(
    "https://shorturl.at/zPSuB"
  );
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  let { id } = useParams();
  const { theme } = useContext(ThemeContext);

  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  useEffect(() => {
    const targetUserId = id || user?._id;
    if (!targetUserId) return;

    const fetchArtworks = async () => {
      try {
        const data = await getArtworksByUserId(targetUserId as string);

        setArtworks((prev) =>
          JSON.stringify(prev) === JSON.stringify(data) ? prev : data || []
        );
      } catch (error) {
        setArtworks([]);
      }
    };
    const fetchAvatar = async () => {
      try {
        setPreviewProfile(user?.profilePicture || "https://shorturl.at/c3o5s");
      } catch (error) {}
    };

    const fetchBackground = async () => {
      try {
        setPreviewBackground(
          user?.backgroundPicture || "https://shorturl.at/zPSuB"
        );
      } catch (error) {}
    };

    fetchAvatar();
    fetchBackground();
    fetchArtworks();
  }, [id, user?._id]);

  // Kiểm tra trạng thái follow
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    // NOTE: no longer requiring a 24-char id (MongoDB ObjectId format) —
    // SQL Server ids are UUIDs/arbitrary strings of varying length now.
    if (!id) {
      navigate("/characters");
      return;
    }

    const getUserProfile = async () => {
      if (id === String(user._id)) {
        setCurrentUser((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(user)) {
            return user;
          }
          return prev;
        });
        return;
      }

      try {
        const userProfile: ApiResponse<User> = (await getUserByIdUrl(
          id ? id : "0"
        )) as ApiResponse<User>;
        if (userProfile.status !== "error" && userProfile.data) {
          setCurrentUser((prev: User) => {
            const filteredProfile = {
              ...userProfile.data,
            };
            const filteredPrev = {
              ...prev,
            };
            if (
              JSON.stringify(filteredPrev) !== JSON.stringify(filteredProfile)
            ) {
              return userProfile.data as User;
            }
            return prev as User;
          });
        }
      } catch (err) {}
    };

    getUserProfile();
  }, [id]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUser?._id && user?._id !== currentUser._id) {
        try {
          const isFollowingResult = await checkFollowing(
            currentUser?._id?.toString() || ""
          );
          setIsFollowing((prev) => {
            if (prev !== isFollowingResult) {
              return isFollowingResult;
            }
            return prev;
          });
        } catch (err: any) {
          setSnackbarFollowError(
            err.error?.message || "Failed to check follow status"
          );
        }
      } else {
        setIsFollowing(false);
      }
    };

    checkFollowStatus();
  }, [user?._id]);

  //Covert Blob to Base64 string to easily view the image
  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function postImageToDatabase(base64Data: string, imageType: string) {
    if (imageType === "profilePicture") {
      let plainBase64Data = base64Data;
      const res = (await PutCreatorAvaterPicture(plainBase64Data)) as any;
      setUser(res.data);
    } else if (imageType === "backgroundPicture") {
      let plainBase64Data = base64Data;
      const res = (await PutCreatorBackgroundPicture(plainBase64Data)) as any;
      setUser(res.data);
    }
  }
  // RESIZED IMAGE MORE THAN 4mb
  function resizeImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const maxFileSize = 4 * 1024 * 1024; // 4MB
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (!event.target || !event.target.result) {
          reject(new Error("FileReader không trả về kết quả."));
          return;
        }
        const result = event.target.result;
        if (typeof result !== "string") {
          reject(new Error("Kết quả của FileReader không phải là string."));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const originalWidth = img.width;
          const originalHeight = img.height;
          // Tính toán scale dựa trên kích thước file (dùng căn bậc hai để giữ tỉ lệ)
          const scale = Math.sqrt(maxFileSize / file.size);
          // Nếu scale >= 1 => file đã nhỏ hơn hoặc bằng 4MB, không cần resize
          if (scale >= 1) {
            resolve(result);
            return;
          }
          const newWidth = Math.floor(originalWidth * scale);
          const newHeight = Math.floor(originalHeight * scale);

          // Tạo canvas và lấy context
          const canvas = document.createElement("canvas");
          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Không thể lấy được canvas context."));
            return;
          }
          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          // Chuyển canvas sang base64
          const base64 = canvas.toDataURL(file.type);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
        img.src = result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
  // END HANDLE MAX SIZED

  const handleImageChange = async (e: any) => {
    const { name, files } = e.target;
    if (name === "profilePicture" || name === "backgroundPicture") {
      const file = files?.[0];
      if (file) {
        try {
          let base64Image;
          if (file.size > 4 * 1024 * 1024) {
            base64Image = await resizeImage(file);
          } else {
            base64Image = await blobToBase64(file);
          }
          // Match the arguments to the function definition
          await postImageToDatabase(base64Image, name); // Here `name` should be of type 'profilePicture' | 'backgroundPicture'
          if (name === "profilePicture") {
            setPreviewProfile(base64Image);
          } else {
            setPreviewBackground(base64Image);
          }
        } catch (error) {}
      }
    }
  };

  const FreeImage = useMemo(() => {
    const freeArtworks = artworks.filter((work) => !work.purchasable);
    return () =>
      freeArtworks.length === 0 ? (
        <PlaceHoldersImageCard text="No free artworks yet" />
      ) : (
        <ImageList variant="masonry" cols={3} gap={8}>
          {freeArtworks.map((work) => (
            <Link key={work._id} to={`/characters/artwork/${work._id}`}>
              <ImageListItem>
                <img
                  src={work.imageFile.preview || work.imageFile.image}
                  alt={work.artworkName}
                  loading="lazy"
                  style={{ width: "100%", height: "auto" }}
                />
              </ImageListItem>
            </Link>
          ))}
        </ImageList>
      );
  }, [artworks]);

  const CostImage = useMemo(() => {
    const costArtworks = artworks.filter((work) => work.purchasable);
    return () =>
      costArtworks.length === 0 ? (
        <PlaceHoldersImageCard text="No items for sale" />
      ) : (
        <ImageList
          sx={{ width: 1200, height: "auto", overflow: "visible" }}
          cols={4}
        >
          {costArtworks.map((work) => (
            <ImageListItem key={work._id}>
              <Link to={`/characters/artwork/${work._id}`}>
                <img
                  src={work.imageFile.preview || work.imageFile.image}
                  alt={work.artworkName}
                  loading="lazy"
                  style={{ height: "200px", width: "100%", objectFit: "cover" }}
                />
              </Link>
              <ImageListItemBar
                title={`$${work.price ?? "??"}`}
                subtitle={work.artworkName}
                actionIcon={
                  <IconButton sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      );
  }, [artworks]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = async () => {
    if (!currentUser?._id) {
      setSnackbarFollowError("User not found");
      return;
    }
    try {
      if (isFollowing) {
        await unfollowUser(currentUser._id as string);
        setIsFollowing(false);
        setCurrentUser((prev) =>
          prev ? { ...prev, followerCount: prev.followerCount - 1 } : prev
        );
        setSnackBarFollow(true);
      } else {
        await followUser(currentUser._id as string);
        setIsFollowing(true);
        setCurrentUser((prev) =>
          prev ? { ...prev, followerCount: prev.followerCount + 1 } : prev
        );
        setSnackBarFollow(true);
      }
    } catch (err: any) {
      setSnackbarFollowError(
        err.error?.message || "Failed to update follow status"
      );
    }
  };

  // HANDLE CHATTING

  const handleChatting = () => {
    const newChat: any = {
      user1Id: null,
      user2Id: currentUser?._id,
      status: 0,
    };
    createChat(newChat);
  };

  return (
    <div className="">
      <div className="headeruser">
        {/* <div className='backgrounduser'>
          <img src={selectedUser.background} alt='Background'></img>
        </div> */}

        <Card sx={{ width: "100%" }}>
          <div
            className="backgrounduser"
            style={{
              backgroundImage: `url('${
                currentUser?.backgroundPicture
                  ? currentUser?.backgroundPicture
                  : previewBackground
              }')`,
            }}
          >
            <div
              className="backgroundPicture"
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                color: "#04a1fd",
                backgroundColor: "#1A1A2E",
                borderRadius: "10px",
                fontSize: "14px",
                top: "80%",
                left: "83%",
                width: "15vw",
              }}
            >
              {/* Check to see if User in sesion is the same as the user in view, if yes, they can edit image */}

              {user?._id === currentUser?._id ? (
                <>
                  <input
                    accept=".png,.jpeg,.jpg,.tif,.gif"
                    style={{ display: "none" }}
                    id={"backgroundPicture"}
                    name={"backgroundPicture"}
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor={"backgroundPicture"}>
                    <Button
                      className="button-edit-background"
                      component="span"
                      startIcon={<CameraAltIcon />}
                    >
                      Edit Cover Image
                    </Button>
                  </label>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <CardContent
            className="infouser1"
            sx={{ backgroundColor: theme.backgroundColor, color: theme.color }}
          >
            <div className="infousername">
              <div className="avataruser">
                <img
                  style={{ outline: `4px solid ${theme.backgroundColor}` }}
                  src={
                    currentUser?.profilePicture
                      ? currentUser.profilePicture
                      : previewProfile
                  }
                />
                <div className="buttonavatar">
                  <div
                    className="profilePicture"
                    style={{
                      backgroundColor: "none",
                      position: "absolute",
                      top: 10,
                      right: 0,
                      transform: "translate(10%, 100%)",
                      zIndex: 2,
                    }}
                  >
                    {/* Check to see if User in sesion is the same as the user in view, if yes, they can edit image */}
                    {user?._id === currentUser?._id ? (
                      <>
                        <input
                          style={{ display: "none" }}
                          accept=".png,.jpeg,.jpg,.tif,.gif"
                          id={"profilePicture"}
                          name={"profilePicture"}
                          type="file"
                          onChange={handleImageChange}
                        />

                        <label htmlFor={"profilePicture"}>
                          <Button
                            style={{ color: "white", borderRadius: "150px" }}
                            component="span" //Component = 'span' allow you to span the lable across the input
                          >
                            <Avatar style={{ outline: "2px solid #fff" }}>
                              <CameraAltIcon />
                            </Avatar>
                          </Button>
                        </label>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="headerusername">
                <Typography
                  gutterBottom
                  variant="h3"
                  component="div"
                  style={{ fontWeight: 700, marginBottom: "5px" }}
                >
                  <div
                    className="headername"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "65px",
                    }}
                  >
                    <div>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </div>
                    <div>
                      {(currentUser?.roleID as Irole)?._id &&
                        [2, 3, 4, 5].includes(
                          Number((currentUser?.roleID as Irole)._id)
                        ) && (
                          <div
                            style={{
                              marginLeft: "10px",
                              transform: "scale(1.2)",
                            }}
                          >
                            <RankEffect
                              type={
                                Number((currentUser?.roleID as Irole)._id) as
                                  | 2
                                  | 3
                                  | 4
                                  | 5
                              }
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </Typography>
                <Box></Box>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 500, fontSize: "18px" }}
                >
                  Followers: {currentUser?.followerCount}
                </Typography>
              </div>{" "}
            </div>

            {currentUser?._id !== user?._id
              ? user && (
                  <div className="buttonheaderuser">
                    <Button
                      className={isFollowing ? "follow" : "following"}
                      style={{ width: "120px", height: "40px" }}
                      variant={isFollowing ? "outlined" : "contained"}
                      onClick={handleClick}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      style={{
                        width: "120px",
                        height: "40px",
                        marginLeft: "10px",
                      }}
                      variant="contained"
                      onClick={handleChatting}
                    >
                      Chat
                    </Button>
                  </div>
                )
              : ""}
          </CardContent>
        </Card>
      </div>
      <div
        className="tabsBackground"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div className="inforuser2">
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{ borderBottom: "2px solid #ECECEC" }}
              className="navofuser"
            >
              <div className="navuser">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                  style={{ color: theme.color2, zIndex: "7" }}
                >
                  <Tab
                    label="Home"
                    {...a11yProps(0)}
                    style={{ color: theme.color2 }}
                  />
                  <Tab
                    label="Shop"
                    {...a11yProps(1)}
                    style={{ color: theme.color2 }}
                  />
                  <Tab
                    label="Favourites"
                    {...a11yProps(2)}
                    style={{ color: theme.color2 }}
                  />
                  {currentUser?._id === user?._id ? (
                    <Tab
                      label="Change Password"
                      {...a11yProps(3)}
                      style={{ color: theme.color2 }}
                    />
                  ) : (
                    ""
                  )}
                  {currentUser?._id === user?._id ? (
                    <Tab
                      label="Edit Profile"
                      {...a11yProps(4)}
                      style={{ color: theme.color2 }}
                    />
                  ) : (
                    ""
                  )}
                </Tabs>
              </div>
              <div className="buttonSubcribe">
                {/* Kiểm tra RankID chính xác dựa vào API trả về */}
                {currentUser?._id !== user?._id ? (
                  currentUser?.allowCommission === true ? (
                    <Button
                      variant="contained"
                      onClick={() => setShowCommissionForm(true)}
                    >
                      <ShoppingBagIcon style={{ marginRight: "5px" }} />
                      Request a Custom Art
                    </Button>
                  ) : (
                    <Button disabled variant="contained">
                      <ShoppingBagIcon style={{ marginRight: "5px" }} />
                      This person cannot receive commissions
                    </Button>
                  )
                ) : (
                  ""
                )}
                {/* Hiển thị form request khi nhấn nút */}
                {showCommissionForm && (
                  <CommissionForm
                    onClose={() => setShowCommissionForm(false)}
                  />
                )}
                {currentUser?._id !== user?._id
                  ? currentUser && (
                      <Button
                        onClick={handleClickOpen}
                        variant="contained"
                        color="error"
                        href=""
                        style={{ marginLeft: "20px" }}
                      >
                        Report
                      </Button>
                    )
                  : ""}
                {/* Popup Report */}

                <Dialog
                  open={open}
                  onClose={handleClose}
                  className="dialog-custom"
                  BackdropProps={{
                    sx: {
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <ReportForm
                    reporterId={String(user?._id)}
                    reportedId={String(currentUser?._id)}
                    onClose={() => setOpen(false)}
                  />
                </Dialog>
              </div>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <div className="tabhome">
                <div className="biouser">
                  <Box
                    // height= {150}
                    width={350}
                    my={4}
                    gap={4}
                    p={2}
                    style={{
                      color: theme.color2,
                      border: "2px solid grey",
                      top: 0, // this defines the top position when it's sticky
                      zIndex: 10, // you may want to add a zIndex to ensure it stacks on top of other contents
                    }}
                    className="boxintroduct"
                  >
                    <h2 className="headintroduct">
                      About {currentUser?.firstName} {currentUser?.lastName}:
                    </h2>
                    <div className="contentintroduct">
                      <CakeIcon className="iconintroduct" />
                      Birthday: {currentUser?.dateOfBirth}
                      {""}
                    </div>
                    <div className="contentintroduct">
                      <RoomIcon className="iconintroduct" />
                      Location: {currentUser?.address}
                    </div>
                    <div className="contentintroduct">
                      <RssFeedIcon className="iconintroduct" />
                      Last Online: {timeAgo(currentUser?.lastLogin as string)}
                      {""}
                    </div>
                    <div className="contentintroduct">
                      <PhoneIcon className="iconintroduct" />
                      Phone: {currentUser?.phoneNumber}
                    </div>
                    <div className="contentintroduct">
                      {" "}
                      <AutoAwesomeIcon className="iconintroduct" />
                      My Bio: {currentUser?.biography}{" "}
                    </div>
                  </Box>
                </div>
                <div className="workofuser">
                  <div className="head-workofuser">
                    <h2 style={{ color: theme.color2 }}> My Works:</h2>
                    <Box>
                      <FreeImage />
                    </Box>
                  </div>
                </div>
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={1}>
              <div style={{ marginLeft: "120px" }}>
                <CostImage />
              </div>
            </CustomTabPanel>

            <CustomTabPanel value={value} index={2}>
              {/* {artworks.length !== 0 ? <AllImage /> : <PlaceHoldersImageCard />} */}
              {currentUser && <FavouritesArtwork userId={currentUser?._id} />}{" "}
              {/* Truyền userId của người dùng đang xem */}
            </CustomTabPanel>

            {/* THIS IS TABPANEL TO EDIT PROFILE */}
            <CustomTabPanel value={value} index={3}>
              <>
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
                      sx={{
                        backgroundColor: theme.backgroundColor,
                        margin: "auto",
                      }}
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
                                Change Password
                              </Typography>
                            </div>
                          </Grid>

                          {/* END OF OTP HANDLE */}
                          <Grid item xs={12}>
                            <CustomizedTextField
                              id="passwword"
                              label="Old Password"
                              name="oldPassword"
                              autoComplete="OldPassword"
                              type="password"
                              fullWidth
                              value={formik.values.oldPassword}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.oldPassword && (
                              <Typography variant="body2" color="red">
                                {formik.errors.oldPassword}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12}>
                            <CustomizedTextField
                              id="passwword"
                              label="New Passwword"
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
                              name="confirmPassword"
                              type="password"
                              autoComplete="confirmPassword"
                              fullWidth
                              value={formik.values.confirmPassword}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.confirmPassword && (
                              <Typography variant="body2" color="red">
                                {formik.errors.confirmPassword}
                              </Typography>
                            )}
                          </Grid>

                          <Grid item xs={12}>
                            <Button
                              disabled={open}
                              variant="contained"
                              type="submit"
                              style={{ marginBottom: "20px" }}
                              fullWidth
                            >
                              Update Password!
                            </Button>
                          </Grid>

                          <Grid item xs={6}>
                            <Link
                              style={{ fontStyle: "italic", color: "grey" }}
                              to={`/forgotpassword`}
                            >
                              {" "}
                              Create an account from the Email? Click here to
                              set the password!
                            </Link>
                          </Grid>
                        </Grid>
                      </form>
                    </Box>
                  </div>
                </div>
              </>
            </CustomTabPanel>

            {/* THIS IS TABPANEL TO EDIT PROFILE */}
            <CustomTabPanel value={value} index={4}>
              <form onSubmit={F4k.handleSubmit}>
                <Grid className="formregister" container spacing={2}>
                  <Grid item xs={12}>
                    <div className="header">
                      <Typography
                        sx={{ color: theme.color }}
                        variant="h4"
                        component="h1"
                        gutterBottom
                      >
                        Edit Profile
                      </Typography>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <CustomizedTextField
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="email"
                      fullWidth
                      value={F4k.values.firstName}
                      onChange={F4k.handleChange}
                    />
                    {F4k.errors.firstName && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.firstName}
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
                      value={F4k.values.lastName}
                      onChange={F4k.handleChange}
                    />
                    {F4k.errors.lastName && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.lastName}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <CustomizedTextField
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="address"
                      fullWidth
                      value={F4k.values.address}
                      onChange={F4k.handleChange}
                    />
                    {F4k.errors.address && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.address}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <CustomizedTextField
                      label="Date (yyyy/MM/dd) "
                      name="date"
                      autoComplete="date"
                      fullWidth
                      value={F4k.values.date}
                      onChange={F4k.handleChange}
                    />

                    {F4k.errors.date && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.date}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <CustomizedTextField
                      id="phoneNumber"
                      label="Phone Number"
                      name="phoneNumber"
                      autoComplete="phoneNumber"
                      fullWidth
                      multiline
                      value={F4k.values.phoneNumber}
                      onChange={F4k.handleChange}
                    />
                    {F4k.errors.phoneNumber && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.phoneNumber}
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
                      value={F4k.values.biography}
                      onChange={F4k.handleChange}
                    />
                    {F4k.errors.biography && (
                      <Typography variant="body2" color="red">
                        {F4k.errors.biography}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      disabled={open}
                      variant="contained"
                      type="submit"
                      style={{ marginBottom: "20px" }}
                      fullWidth
                    >
                      Update Profile!
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CustomTabPanel>
          </Box>
        </div>
      </div>

      <Snackbar
        open={snackbarChangePassword}
        autoHideDuration={2000}
        onClose={snackbarClose}
      >
        <Alert
          onClose={snackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Change successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarChangePasswordError}
        autoHideDuration={2000}
        onClose={snackbarClose}
      >
        <Alert
          onClose={snackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Change not successful!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbarFollow}
        autoHideDuration={2000}
        onClose={snackbarClose}
      >
        <Alert
          onClose={snackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {isFollowing ? "Followed successfully!" : "Unfollowed successfully!"}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!snackbarFollowError}
        autoHideDuration={2000}
        onClose={snackbarClose}
      >
        <Alert
          onClose={snackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarFollowError}
        </Alert>
      </Snackbar>
    </div>
  );
}
