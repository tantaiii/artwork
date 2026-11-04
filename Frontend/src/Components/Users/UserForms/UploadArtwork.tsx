import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Select, Autocomplete, TextField, Chip } from "@mui/material";
import CustomizedButton from "../../StyledMUI/CustomizedButton.tsx";
import { ThemeContext } from "../../Themes/ThemeProvider.tsx";
import CustomizedTextField from "../../StyledMUI/CustomizedTextField.tsx";
import CustomizedSwitch from "../../StyledMUI/CustomizedSwitch.jsx";
import CustomizedTypography from "../../StyledMUI/CustomizedTypography.jsx";
import CustomizedSelect from "../../StyledMUI/CustomizedSelect.jsx";
import CustomizedImageButton from "../../StyledMUI/CustomizedImageButton.jsx";
import * as Yup from "yup";
import { useFormik, FieldArray, FormikProvider } from "formik"; // useFormik instead of a custom handleChange event
import axios from "axios";
import { Tag } from "../../../Interfaces/TagInterface.ts";
import {
  FormControlLabel,
  Input,
  InputLabel,
  FormControl,
  MenuItem,
} from "@mui/material";
import { Creator } from "../../../Interfaces/UserInterface.ts";
import { useNavigate } from "react-router-dom";
import { Artwork } from "../../../Interfaces/ArtworkInterfaces.ts";
import Dialog from "@mui/material/Dialog";
import { GetCreatorByAccountID } from "../../../API/UserAPI/GET.tsx";
import { useAuth } from "../../../secure/AuthContext.tsx";
import { useTagGetAPI } from "../../../API/TagAPI/GET.tsx";
import { useArtworkPostAPI } from "../../../API/ArtworkAPI/POST.tsx";
import { User } from "../../../Interfaces/UserInterface.ts";
import { ApiResponse } from "../../../service/api.tsx";
function UploadArtwork() {
  const { theme } = useContext(ThemeContext);
  const defaultPreview =
    "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-1/412275689_1752721802217153_2393610321619100452_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=xk0cNLfp64MQ7kNvgERpEBP&_nc_oc=AdgqMG_zsOI-uSConoJjAHY_iE5IyJefYa8lm8IbStuuQuvtSEPVh6lw7pna9uk95DONTt3t55fXwDFgr9sSuEMk&_nc_zt=24&_nc_ht=scontent.fdad3-6.fna&_nc_gid=Ait6pYWsX0SurZJiXWjxDDi&oh=00_AYDDXDsNgryx-m8TRMK-zaQGeA2K1saXboiE9gqe3Y4wZA&oe=67BD1B40";
  const [preview, setPreview] = useState<string>(defaultPreview);
  const [blobImage, setBlobImage] = useState();
  const [priceSwitch, setPriceSwitch] = useState(false);
  const [listOfTags, setListOfTags] = useState<Tag[] | undefined>([]);
  const redirectUrl = useNavigate();
  const [showInsufficientFunds, setShowInsufficientFunds] =
    React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const { getTagList } = useTagGetAPI();
  const { postImage } = useArtworkPostAPI();
  //Get tagList
  useEffect(() => {
    const tagList = async () => {
      const Tags: Tag[] | undefined = await getTagList();
      setListOfTags(Tags);
    };
    tagList();
  }, []);

  //Covert Blob to Base64 string to easily view the image
  function blobToBase64(blob: any, callback: any) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      callback(base64data);
    };
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

  const handleImageChange = (e: any) => {
    const { name, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      const file = files[0];

      setBlobImage(file);

      resizeImage(file)
        .then((resizedBase64) => {
          setPreview(resizedBase64);
        })
        .catch((error) => {});
    } else {
      alert("Vui lòng chọn một ảnh hợp lệ!");
    }
  };

  const handleSwitchChange = (e: any) => {
    setPriceSwitch(e.target.checked);
    formik.values.purchasable = priceSwitch;
  };

  const handlePriceVisibility = () => {
    return (
      priceSwitch && (
        <div className="priceField">
          <CustomizedTextField
            sx={{ float: "right" }}
            name="price"
            label="Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            fullWidth
          />
        </div>
      )
    );
  };

  const formik = useFormik<Artwork>({
    validateOnChange: false,
    validateOnBlur: false,

    initialValues: {
      userID: "",
      artworkName: "",
      description: "",
      likes: 0,
      purchasable: false,
      price: 0,
      imageFile: {
        imageFileFE: "",
        preview: "",
        image: "",
      },
      status: "1",
      views: 0,
      comments: 0,
      favorites: 0,
      dateCreated: new Date(),
      tagID: [],
    },
    validationSchema: Yup.object({
      artworkName: Yup.string().required(
        "Please enter a name for your artwork."
      ),
      description: Yup.string().required("Please describe your artwork."),
    }),
    onSubmit: async (values) => {
      if (!preview || preview === defaultPreview || !preview.includes(",")) {
        alert("Please add your image!");
        return;
      }
      if (!preview.startsWith("data:image/")) {
        alert("Ảnh upload không hợp lệ!");
        return;
      }
      // const image = blobToBase64(preview, (base64data: any) => {});
      values.imageFile!.imageFileFE = preview || "";
      values.purchasable = priceSwitch;
      values.tagID = values.tagID?.map((tag: any) =>
        typeof tag === "object" ? tag.tagID : tag
      );

      try {
        const response = (await postImage(values)) as ApiResponse<Artwork>;
        if (response.status === 200 || response.data?.status === "success") {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate(
              `/characters/artwork/${
                response.data?._id || response.data.data?._id
              }`
            );
          }, 3000);
        }
      } catch (error) {
        alert("An error occurred while uploading the artwork.");
      }
    },
  });

  return (
    <>
      <div
        className="formup"
        style={{
          backgroundImage: "url('/images/desk.jpg')",
          backgroundSize: "cover",
        }}
      >
        <div
          className="userInfoForm"
          style={{ backgroundColor: `rgba(${theme.rgbBackgroundColor},0.80)` }}
        >
          <form onSubmit={formik.handleSubmit}>
            <CustomizedTypography variant="h4" component="h2" gutterBottom>
              Share Us Your Creation
            </CustomizedTypography>
            <div className="allFieldForm">
              <Box
                className="textFieldBox"
                sx={{
                  width: "50%",
                  backgroundColor: theme.backgroundColor,
                  padding: "2%",
                  border: `solid 1px ${theme.color}`,
                  borderRadius: "5px",
                }}
              >
                <div className="artTextField" style={{ marginBottom: "2%" }}>
                  <CustomizedTextField
                    name="artworkName"
                    label="Give Your Amazing Art A Name"
                    value={formik.values.artworkName}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                  {formik.errors.artworkName && (
                    <Typography variant="body2" color="red">
                      {formik.errors.artworkName}
                    </Typography>
                  )}
                </div>
                <div className="artTextField">
                  <CustomizedTextField
                    name="description"
                    label="Description Of Your Art"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    multiline
                    fullWidth
                    rows={4}
                  />
                  {formik.errors.description && (
                    <Typography variant="body2" color="red">
                      {formik.errors.description}
                    </Typography>
                  )}
                </div>
                <div className="artTextField" style={{ marginTop: "2%" }}>
                  <CustomizedImageButton
                    name="imageFile"
                    onChange={handleImageChange}
                    fullWidth
                  />
                  {(formik.errors.imageFile as any)?.imageFileFE && (
                    <Typography variant="body2" color="error">
                      {(formik.errors.imageFile as any)?.imageFileFE}
                    </Typography>
                  )}
                </div>
              </Box>
              <Box
                className="priceBox"
                sx={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: theme.color,
                }}
              >
                <FormControlLabel
                  sx={{ color: theme.color, marginBottom: "10%" }}
                  control={
                    <CustomizedSwitch
                      checked={priceSwitch}
                      onChange={(event: any) => handleSwitchChange(event)}
                      name="purchasable"
                    />
                  }
                  label="Is Purchasable?"
                />
                {handlePriceVisibility()}
              </Box>
            </div>
            <Box className="tagAndpreviewBox">
              {listOfTags?.length !== 0 ? (
                <FormikProvider value={formik}>
                  <div
                    className="tagField"
                    style={{
                      backgroundColor: theme.backgroundColor,
                      border: `solid 1px ${theme.color}`,
                      padding: "2%",
                      borderRadius: "5px",
                    }}
                  >
                    <FieldArray
                      name="tagID"
                      render={(arrayHelpers) => (
                        <>
                          <Autocomplete
                            options={(listOfTags || []).filter(
                              (option: Partial<Tag>) =>
                                !formik.values.tagID!.some(
                                  (tag: any) => tag._id === option._id
                                )
                            )}
                            getOptionLabel={(option) => option.tagName}
                            isOptionEqualToValue={(option: any, value: any) =>
                              option._id === value._id
                            }
                            onChange={(event, value: any) => {
                              if (value) {
                                const newTag = {
                                  tagID: value._id,
                                  tagName: value.tagName,
                                };
                                arrayHelpers.push(newTag);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Tag"
                                variant="outlined"
                                style={{
                                  color: theme.color,
                                  marginBottom: "2%",
                                  border: `1px solid ${theme.color}`,
                                  borderRadius: "5px",
                                }}
                                InputLabelProps={{
                                  style: { color: theme.color },
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  style: { color: theme.color3 },
                                }}
                              />
                            )}
                          />
                          <div className="tagChips">
                            {formik.values.tagID!.map(
                              (tag_id: any, index: any) => {
                                const selectedTag = listOfTags?.find(
                                  (t: any) => t._id === tag_id.tagID
                                );

                                return (
                                  <Chip
                                    key={index}
                                    label={
                                      selectedTag?.tagName || "Unknown Tag"
                                    }
                                    onDelete={() => arrayHelpers.remove(index)}
                                    style={{
                                      margin: "4px",
                                      border: `1px solid ${theme.color}`,
                                      backgroundColor: theme.backgroundColor,
                                      color: theme.color,
                                      boxShadow: `0 0 5px ${theme.color}`,
                                    }}
                                  />
                                );
                              }
                            )}
                          </div>
                        </>
                      )}
                    />
                  </div>
                </FormikProvider>
              ) : (
                ""
              )}
              <div className="imageBox">
                <Typography
                  variant="h6"
                  color={theme.color}
                  sx={{ textAlign: "right" }}
                >
                  Preview Image
                </Typography>
                <img
                  style={{
                    border: `solid 1px ${theme.color}`,
                    backgroundColor: theme.backgroundColor,
                  }}
                  className="previewImage"
                  src={preview}
                  alt="Preview Here!"
                />
              </div>
            </Box>
            <CustomizedButton
              sx={{
                display: "block",
                width: "50%",
                margin: "auto",
                marginTop: "5vh",
              }}
              variant="contained"
              type="submit"
            >
              Welcome To The Wolrd!
            </CustomizedButton>
            <Dialog
              open={showInsufficientFunds}
              aria-labelledby="insufficient-funds-dialog"
              className="dialog-custom"
            >
              <div className="insufficient-funds-dialog status-dialog">
                <h2>Photo Posting Limit in This month, Upgrade Rank Please</h2>
                <p>You will be redirected to Package page...</p>
              </div>
            </Dialog>

            {/* Success popup */}
            <Dialog
              open={showSuccess}
              aria-labelledby="success-dialog"
              className="dialog-custom"
            >
              <div className="success-dialog status-dialog">
                <h2>Upload Successful!</h2>
                <p>You will be redirected to artwork page...</p>
              </div>
            </Dialog>
          </form>
        </div>
      </div>
    </>
  );
}
export default UploadArtwork;
