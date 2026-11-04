import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  TextField,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CustomizedButton from "../StyledMUI/CustomizedButton.tsx";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import CustomizedTextField from "../StyledMUI/CustomizedTextField.tsx";
import CustomizedSwitch from "../StyledMUI/CustomizedSwitch.jsx";
import CustomizedTypography from "../StyledMUI/CustomizedTypography.jsx";
import * as Yup from "yup";
import { useFormik, FieldArray, FormikProvider } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { Tag } from "../../Interfaces/TagInterface.ts";
import { FormControlLabel } from "@mui/material";
import { useUpdateArtwork } from "../../API/ArtworkAPI/PUT.tsx";
import { useAuth } from "../../secure/AuthContext.tsx";
import { useTagGetAPI } from "../../API/TagAPI/GET.tsx";
import { useArtworkGetAPI } from "../../API/ArtworkAPI/GET.tsx";
import { ApiResponse } from "../../service/api.tsx";

function UpdateArtwork() {
  const { id } = useParams();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { postArtwork } = useUpdateArtwork();
  const { getTagList } = useTagGetAPI();
  const { getArtworkById } = useArtworkGetAPI();

  const [priceSwitch, setPriceSwitch] = useState(false);
  const [listOfTags, setListOfTags] = useState<Tag[] | undefined>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const validationSchema = Yup.object({
    artworkName: Yup.string().required("NAME! I want a name! Please..."),
    description: Yup.string().required("What? Tell me more about your work."),
    price: Yup.number()
      .min(0, "Price must be positive")
      .nullable() // Allow null/undefined nếu không purchasable
      .transform((value) => (isNaN(value) ? null : value)) // Clean NaN
      .when("purchasable", {
        is: true,
        then: (schema) =>
          schema.required("Price is required when purchasable").min(0.01),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const formik = useFormik<Partial<Artwork>>({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      _id: "",
      artworkName: "",
      description: "",
      purchasable: false,
      price: 0,
      tagID: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      values.purchasable = priceSwitch;

      values.tagID = (values.tagID || [])
        .map((tag: any) => tag?._id)
        .filter(Boolean);

      try {
        const response = await postArtwork(values);
        const apiResponse = response as ApiResponse;

        if (apiResponse?.data?.status === "success") {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate(`/characters/artwork/${values._id}`);
          }, 2000);
        } else {
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
      } catch (error) {
        setShowError(true);
      }
    },
  });

  // SỬA: Wrap fetchData bằng useCallback để stable, tránh loop
  const fetchData = useCallback(async () => {
    if (!user || !id || fetched) return;

    setLoading(true);
    try {
      const tags: Tag[] | undefined = await getTagList();
      if (!tags) {
        setShowError(true);
        return;
      }
      setListOfTags(tags);

      const artworkData = (await getArtworkById(id)) as ApiResponse;
      if (!artworkData?.data) {
        setShowError(true);
        return;
      }

      const rawTagList = artworkData.data.tagID || [];
      const artworkTags: Tag[] = rawTagList
        .filter((tag: any) => tag !== null && tag !== undefined)
        .map((rawTag: any) => {
          if (typeof rawTag === "string") {
            const foundTag = tags.find((t: Tag) => t._id === rawTag);
            return foundTag
              ? { _id: foundTag._id, tagName: foundTag.tagName }
              : null;
          } else if (typeof rawTag === "object" && (rawTag._id || rawTag.id)) {
            return {
              _id: rawTag._id || rawTag.id,
              tagName: rawTag.tagName,
            };
          }
          return null;
        })
        .filter(Boolean) as Tag[];

      setPriceSwitch(artworkData.data.purchasable || false);
      formik.setValues({
        _id: artworkData.data._id || "",
        artworkName: artworkData.data.artworkName || "",
        description: artworkData.data.description || "",
        purchasable: artworkData.data.purchasable || false,
        imageFile: artworkData.data.imageFile || null,
        price: Number(artworkData.data.price) || 0,
        tagID: artworkTags,
      });

      setFetched(true);
    } catch (error) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [user, id, fetched, getTagList, getArtworkById, formik]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const availableTags = useMemo(() => {
    if (!listOfTags || !formik.values.tagID) return [];
    const selectedIds = formik.values.tagID
      .map((tag: any) => tag?._id)
      .filter(Boolean);
    return listOfTags.filter(
      (option: Tag) => !selectedIds.includes(option._id)
    );
  }, [listOfTags, formik.values.tagID]);

  const blobToBase64 = (blob: Blob, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => callback(reader.result as string);
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setPriceSwitch(checked);
    formik.setFieldValue("purchasable", checked);
  };

  const handlePriceVisibility = () =>
    priceSwitch && (
      <Box sx={{ ml: "auto", width: "100%" }}>
        {" "}
        <CustomizedTextField
          name="price"
          label="Price"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
          fullWidth
        />
      </Box>
    );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2, color: theme.color }}>
          Loading artwork data...
        </Typography>
      </Box>
    );
  }

  return (
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
            Update Your Artwork
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
              <Box className="artTextField" sx={{ marginBottom: "2%" }}>
                <CustomizedTextField
                  name="artworkName"
                  label="Give Your Amazing Art A Name"
                  value={formik.values.artworkName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.artworkName &&
                    Boolean(formik.errors.artworkName)
                  }
                  helperText={
                    formik.touched.artworkName && formik.errors.artworkName
                  }
                  fullWidth
                />
              </Box>
              <Box className="artTextField">
                <CustomizedTextField
                  name="description"
                  label="Description Of Your Art"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  multiline
                  fullWidth
                  rows={4}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Box>
            </Box>
            <Box
              className="priceBox"
              sx={{
                backgroundColor: theme.backgroundColor,
                border: `solid 1px ${theme.color}`,
                padding: "2%",
                borderRadius: "5px",
              }}
            >
              <FormControlLabel
                sx={{ color: theme.color, marginBottom: "10%" }}
                control={
                  <CustomizedSwitch
                    checked={priceSwitch}
                    onChange={handleSwitchChange}
                    name="purchasable"
                    disabled={true}
                  />
                }
                label="Is Purchasable?"
              />
              {handlePriceVisibility()}
            </Box>
          </div>
          <Box className="tagAndpreviewBox">
            {listOfTags && listOfTags.length > 0 && (
              <FormikProvider value={formik}>
                <Box
                  className="tagField"
                  sx={{
                    backgroundColor: theme.backgroundColor,
                    border: `solid 1px ${theme.color}`,
                    padding: "2%",
                    borderRadius: "5px",
                    marginRight: "2%",
                  }}
                >
                  <FieldArray
                    name="tagID"
                    render={(arrayHelpers) => (
                      <>
                        <Autocomplete
                          options={availableTags} // SỬA: Use memoized
                          getOptionLabel={(option: Tag) => option.tagName || ""}
                          isOptionEqualToValue={(option: Tag, value: any) =>
                            option._id === (value?._id || value?.id)
                          }
                          onChange={(_, value: Tag | null) => {
                            if (value) {
                              arrayHelpers.push({
                                _id: value._id,
                                tagName: value.tagName,
                              });
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Tag"
                              variant="outlined"
                              sx={{
                                marginBottom: "2%",
                                "& .MuiOutlinedInput-root": {
                                  color: theme.color3,
                                  border: `1px solid ${theme.color}`,
                                  borderRadius: "5px",
                                },
                                "& .MuiInputLabel-root": { color: theme.color },
                              }}
                            />
                          )}
                        />
                        <div className="tagChips">
                          {formik.values.tagID
                            ?.filter((tagID: any) => tagID?._id)
                            .map((tagID: any, index: number) => {
                              const selectedTag = listOfTags?.find(
                                (t: Tag) => t._id === tagID._id
                              );

                              return (
                                <Chip
                                  key={tagID._id || index}
                                  label={
                                    selectedTag?.tagName ||
                                    tagID.tagName ||
                                    "Unknown Tag"
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
                            })}
                        </div>
                      </>
                    )}
                  />
                </Box>
              </FormikProvider>
            )}
            <Box className="imageBox">
              <Typography
                variant="h6"
                sx={{ color: theme.color, textAlign: "right" }}
              >
                Preview Image
              </Typography>
              <img
                style={{
                  border: `solid 1px ${theme.color}`,
                  backgroundColor: theme.backgroundColor,
                  width: "100%",
                  height: "auto",
                }}
                className="previewImage"
                src={formik.values.imageFile?.image || "/placeholder.jpg"}
                alt="Preview"
              />
            </Box>
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
            Update Artwork
          </CustomizedButton>
        </form>
      </div>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">Artwork updated successfully!</Alert>
      </Snackbar>
      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error">
          Failed to update artwork. Please try again.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UpdateArtwork;
