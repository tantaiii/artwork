import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import '../../css/CommissionForm.css';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UserGetAPI } from '../../API/UserAPI/GET.tsx';
import { CommissionPostAPI } from '../../API/CommissionAPI/POST.tsx';
import { useAuth } from '../../secure/AuthContext.tsx';

export default function CommissionForm({ onClose }) {
  const [receiver, setReceiver] = useState<any>(null);
  const [sendCompleted, setSendCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { createCommission } = CommissionPostAPI();

  const { getUserByIdUrl } = UserGetAPI();
  const getUserByIdUrlRef = useRef(getUserByIdUrl);
  useEffect(() => {
    getUserByIdUrlRef.current = getUserByIdUrl;
  }, [getUserByIdUrl]);

  const handleOpenSnackbar = () => setOpen(true);
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    if (sendCompleted) navigate(`../profile/${id}`);
  };

  useEffect(() => {
    const fetchReceiver = async () => {
      if (!id) return;
      try {
        const response = await getUserByIdUrlRef.current(id);
        const userData = response.data;
        setReceiver(userData);
      } catch (error) {
        throw error;
      }
    };
    fetchReceiver();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      phoneNumber: user?.phoneNumber ?? "",
      email: user?.email ?? "",
      description: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().required("Please enter your phone number"),
      email: Yup.string().email("Invalid email").required("Please enter your email"),
      description: Yup.string().required("Describe your commission request"),
    }),

    onSubmit: async (values) => {
      if (!receiver?._id) {
        return;
      }

      const receiverId = receiver._id;

      try {
        setLoading(true);
        await createCommission(String(receiverId), {
          phoneNumber: values.phoneNumber,
          email: values.email,
          description: values.description,
        });

        setSendCompleted(true);
        handleOpenSnackbar();
        setTimeout(() => onClose(), 3000);
      } catch (error) {
        setSendCompleted(false);
        handleOpenSnackbar();
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className='commission'>
        <Box
          width={700}
          my={4}
          display="flex"
          alignItems="center"
          gap={4}
          p={2}
          sx={{ border: '2px solid grey' }}
          style={{ background: 'whitesmoke', margin: 'auto', paddingLeft: '35px', paddingRight: '35px', marginBottom: '40px', transform: 'translateY(8%)' }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid className='formregister' container spacing={2}>
              <Grid item xs={12}>
                <div className='header'>
                  <Typography variant="h5" component="h1" gutterBottom>
                    Art Commission Request
                  </Typography>
                </div>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className='text'
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Contact"
                  fullWidth
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className='text'
                  id="email"
                  name="email"
                  label="Email"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  id="description"
                  name="description"
                  label="Description"
                  autoComplete="description"
                  fullWidth
                  multiline
                  rows={5}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                />
                <Grid item xs={12}>
                  <div className='note'>
                    *Suggestion: You can fill in the box describing the size of the art and the time you want to complete the work.
                  </div>
                </Grid>
                {formik.errors.description && (
                  <Typography variant="body2" color="red">
                    {formik.errors.description}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={6}>
                <Button
                  variant="contained"
                  type="submit"
                  style={{ marginBottom: '20px', width: '100%' }}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  style={{ marginBottom: '20px', width: '100%' }}
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert
            onClose={handleCloseSnackbar}
            severity={sendCompleted ? "success" : "error"}
            sx={{ width: '100%' }}
          >
            {sendCompleted
              ? "Your form has been submitted successfully!"
              : "Sending Form Failed!"}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}