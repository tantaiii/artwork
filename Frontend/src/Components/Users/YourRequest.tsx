import { ThemeContext } from '../Themes/ThemeProvider.tsx';
import Box from '@mui/material/Box';
import '../../css/YourRequest.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useCommissionGetAPI } from '../../API/CommissionAPI/GET.tsx';
import { useAuth } from '../../secure/AuthContext.tsx';
import { Commission } from '../../Interfaces/CommissionInterface.ts';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import Stack from '@mui/material/Stack';

export default function YourRequest() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getCommissionByRequestorId } = useCommissionGetAPI();

  const [commissionList, setCommissionList] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCommissions = async () => {
      if (!user?._id) return;

      setLoading(true);
      try {
        const response = await getCommissionByRequestorId();
        if (response?.data) {
          const sorted = response.data.sort((a: Commission, b: Commission) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
          );
          setCommissionList(sorted);
        }
      } catch (err) {
        throw err
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [user?._id]);

  const handleClickOpen = (commission: Commission) => {
    setSelectedCommission(commission);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCommission(null);
  };

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': { padding: theme.spacing(2) },
    '& .MuiDialogActions-root': { padding: theme.spacing(1) },
  }));

  const steps = ['Accept requests', 'Work in progress', 'Submit Artwork', 'Commission Complete!'];

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "Not set";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Not set" : d.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='yourRequest'>
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box className='box'
        sx={{
          color: theme.color,
          backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
          transition: theme.transition,
          width: '85%',
          margin: 'auto',
          borderRadius: '5px',
          marginBottom: '15px',
          minHeight: '800px'
        }}>
        <h1>Your Request:</h1>
        <Divider variant='middle' sx={{ borderColor: theme.color }} />

        <div className='listcommission' style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingBottom: '40px' }}>
          <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}
            style={{
              borderTop: '1px solid black',
              borderLeft: '1px solid black',
              borderRight: '1px solid black',
              borderRadius: '10px',
              padding: 0,
              marginBottom: '50px',
              marginTop: '30px'
            }}>
            {commissionList.length === 0 && !loading ? (
              <Typography variant="h6" textAlign="center" color="text.secondary" py={8}>
                You haven't sent any commission requests yet.
              </Typography>
            ) : (
              commissionList.map((commission) => (
                <div key={commission._id}>
                  <ListItem alignItems="flex-start">
                    <div className='onecommission' style={{ width: '100%', display: 'flex' }}>
                      <div className='content' style={{ flex: 1 }}>
                        <ListItemText>
                          <div className='header' style={{ display: 'flex', marginBottom: '15px', alignItems: 'center' }}>
                            {/* Avatar trạng thái */}
                            {commission.accept === null && (
                              <Avatar style={{ background: theme.color, width: 48, height: 48 }}>
                                <NotificationsActiveIcon />
                              </Avatar>
                            )}
                            {commission.accept === true && (
                              <Avatar style={{ background: '#10AF27', width: 48, height: 48 }}>
                                <CheckIcon />
                              </Avatar>
                            )}
                            {commission.accept === false && (
                              <Avatar style={{ background: 'red', width: 48, height: 48 }}>
                                <ClearIcon />
                              </Avatar>
                            )}

                            <Typography variant='h5' style={{ margin: '0 20px', fontWeight: 600 }}>
                              You are requesting a commission to:
                            </Typography>
                          </div>

                          <div className='contentcommission'>
                            <Box sx={{ mb: 3 }}>
                              {/* PROFILE LINK - GIỐNG HỆT YourCommission.tsx */}
                              <Link
                                component={RouterLink}
                                to={`/characters/profile/${commission.reciever._id}`}
                                underline="none"
                                sx={{ display: 'block' }}
                              >
                                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                  <Avatar
                                    src={commission.reciever.profilePicture || "https://i.pravatar.cc/150"}
                                    alt="Avatar"
                                    sx={{ width: 56, height: 56, border: "3px solid", borderColor: "grey.300" }}
                                  />
                                  <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    sx={{
                                      color: "primary.main",
                                      "&:hover": { textDecoration: "underline" },
                                    }}
                                  >
                                    {commission.reciever.firstName} {commission.reciever.lastName}
                                  </Typography>
                                </Stack>
                              </Link>

                              {/* Contact Info */}
                              <Stack spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="body1" color="text.secondary">
                                  <strong>Phone:</strong> {commission.phoneNumber}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                  <strong>Email:</strong> {commission.email}
                                </Typography>
                              </Stack>

                              {/* Description */}
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                                  Description
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-wrap" }}>
                                  {commission.description}
                                </Typography>
                              </Box>

                              {/* Dates */}
                              <Stack spacing={1.5}>
                                <Box>
                                  <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    Created
                                  </Typography>
                                  <Typography variant="body2">
                                    {formatDateTime(commission.creationDate)}
                                  </Typography>
                                </Box>

                                {commission.acceptanceDate && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                      Accepted
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatDateTime(commission.acceptanceDate)}
                                    </Typography>
                                  </Box>
                                )}

                                {commission.completionDate && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="success.main">
                                      Completed
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                      {formatDateTime(commission.completionDate)}
                                    </Typography>
                                  </Box>
                                )}

                                {commission.artworkURL && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                      Artwork
                                    </Typography>
                                    <Link href={commission.artworkURL} target="_blank" rel="noopener" sx={{ display: "block" }}>
                                      <Typography
                                        variant="body2"
                                        color="primary"
                                        sx={{
                                          wordBreak: "break-all",
                                          "&:hover": { textDecoration: "underline" },
                                        }}
                                      >
                                        {commission.artworkURL}
                                      </Typography>
                                    </Link>
                                  </Box>
                                )}

                                {commission.message && (
                                  <Box>
                                    <Typography variant="caption" fontWeight={600} color="error.main">
                                      Rejected Reason
                                    </Typography>
                                    <Typography variant="body2" color="error.main" fontWeight={500}>
                                      {commission.message}
                                    </Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Box>
                          </div>
                        </ListItemText>
                      </div>

                      {/* Button */}
                      <div className='button' style={{ display: 'flex', alignItems: 'center', paddingRight: '20px' }}>
                        {commission.accept === true ? (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#10AF27', padding: '10px 30px' }}
                            onClick={() => handleClickOpen(commission)}
                          >
                            Track the process
                          </Button>
                        ) : commission.accept === false ? (
                          <Button variant="contained" disabled style={{ padding: '10px 40px' }}>
                            Commission Declined
                          </Button>
                        ) : (
                          <Button variant="contained" disabled style={{ padding: '10px 40px', backgroundColor: '#1976d2' }}>
                            Waiting To Be Accepted
                          </Button>
                        )}
                      </div>
                    </div>
                  </ListItem>
                  <Divider component="li" style={{ backgroundColor: 'black' }} />
                </div>
              ))
            )}
          </List>
        </div>

        {/* Dialog Track Progress */}
        <BootstrapDialog
          onClose={handleClose}
          open={open}
          fullWidth
          maxWidth='md'
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Track the progress
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent dividers>
            {selectedCommission && (
              <Box sx={{ width: '90%', margin: 'auto', py: 4 }}>
                <Stepper activeStep={selectedCommission.progress || 0}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {selectedCommission.artworkURL && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Final Artwork
                    </Typography>
                    <Link href={selectedCommission.artworkURL} target="_blank" rel="noopener noreferrer">
                      <Typography variant="body1" color="primary" sx={{ wordBreak: 'break-all', fontSize: '1.1rem' }}>
                        {selectedCommission.artworkURL}
                      </Typography>
                    </Link>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
        </BootstrapDialog>
      </Box>
    </div>
  );
}