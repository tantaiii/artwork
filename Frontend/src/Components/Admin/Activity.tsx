import React, { useEffect, useState } from "react";
import { Chip, Container, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import AdminNavbar from "./NavigationAd";
import {
  GetListActivity,
  GetListAllTransactions,
  GetListPayment,
} from "../../API/AdminAPI/GET.tsx";
import { GetCreatorByID } from "../../API/UserAPI/GET.tsx";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import {
  GetPaymentJava,
  Payment,
} from "../../Interfaces/PaymentIntrerfaces.ts";
import { User } from "../../Interfaces/UserInterface.ts";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { GetPaymentAPI } from "../../API/PaymentAPI/GET.tsx";
import { GetTransactionApi } from "../../API/TransactionAPI/GET.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { InteractGetAPI } from "../../API/InteractAPI/GET.tsx";

interface Activity {
  ownerName: string;
  activityName: string;
  userInteract: string;
  activityDate: string;
}
interface Transaction {
  _id: string;
  price: number;
  dateToBuy?: string; // String ISO từ backend
  buyerID: User; // Populated object
  sellerID: User;
  artworkID: Artwork;
}

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index } = props;
  return value === index ? <>{children}</> : null;
}

export default function Activity() {
  const [value, setValue] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userPayment, setUserPayment] = useState<User[]>([]);
  const [loading, setLoading] = useState(false); // Global loading, but set false initial
  const [activityPage, setActivityPage] = useState(0);
  const [transactionPage, setTransactionPage] = useState(0);
  const [paymentPage, setPaymentPage] = useState(0);
  const [transactionTotal, setTransactionTotal] = useState(0); // Add total for server-side
  const [paymentTotal, setPaymentTotal] = useState(0); // Add total for server-side
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [status, setStatus] = useState<boolean>(true);
  const navigate = useNavigate();
  const { getTransaction } = GetTransactionApi(); // Assume paginated for all transactions (admin view)
  const { getAllPayments } = GetPaymentAPI(); // Assume paginated getAllPayments(page, limit)
  const [activityTotal, setActivityTotal] = useState(0);
  const { getActivities } = InteractGetAPI();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setActivityPage(0);
    setTransactionPage(0);
    setPaymentPage(0);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setActivityPage(0);
    setTransactionPage(0);
    setPaymentPage(0);
  };
  const handlePageChange = (tabIndex: number, newPage: number) => {
    switch (tabIndex) {
      case 0:
        setActivityPage(newPage);
        break;
      case 1:
        setTransactionPage(newPage);
        break;
      case 2:
        setPaymentPage(newPage);
        break;
    }
  };

  useEffect(() => {
    if (value !== 0) return; // Only fetch when tab 0

    const fetchActivities = async () => {
      setLoading(true);
      try {
        const actualPage = activityPage + 1;
        const response = await getActivities(actualPage, rowsPerPage);
        const apiRes = response as ApiResponse;

        const mappedActivities: Activity[] = (apiRes.data?.activities || []).map((act: any) => {
          const owner = act.artworkID?.userID || act.threadID?.userId;
          const ownerName = owner
            ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() || "Unknown"
            : "Unknown";

          const userInteract = act.userID
            ? `${act.userID.firstName || ""} ${act.userID.lastName || ""}`.trim() || "Unknown User"
            : "Unknown User";

          return {
            ownerName,
            activityName: act.activityType,
            userInteract,
            activityDate: act.createdAt,
          };
        });

        setActivities(mappedActivities);
        setActivityTotal(apiRes.data?.totalItems || 0);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [value, activityPage, rowsPerPage]);

  useEffect(() => {
    if (value !== 1) return; // Only fetch when tab 1

    setLoading(true);
    const fetchTransactions = async () => {
      try {
        const actualPage = transactionPage + 1;
        const response = await getTransaction(actualPage, rowsPerPage);
        const apiRes = response as ApiResponse;
        setTransactions(apiRes.data?.transactions || []);
        setTransactionTotal(apiRes.data?.totalItems || 0);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [value, transactionPage, rowsPerPage]);

  useEffect(() => {
    if (value !== 2) return; // Only fetch when tab 2

    setLoading(true);
    const fetchPayments = async () => {
      try {
        const actualPage = paymentPage + 1;
        const response = await getAllPayments(actualPage, rowsPerPage); // Assume paginated
        const apiRes = response as ApiResponse;
        setPayments(apiRes.data?.payments || []); // Match structure
        setPaymentTotal(apiRes.data?.total || apiRes.data?.totalItems || 0);
        setLoading(false);

        // Fetch userPayment if needed (assume populated in payments.userId)
        setUserPayment(apiRes.data?.userId || []);
      } catch (error) {
        throw error;
      }
    };
    fetchPayments();
  }, [value, paymentPage, rowsPerPage]);

  const handleUserClick = (accountId: string) => {
    window.open(`/characters/profile/${accountId}`);
  };

  const handleArtworkClick = (artworkId: string) => {
    window.open(`/characters/artwork/${artworkId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Container style={{ marginLeft: "300px" }}>
        <Typography
          variant="h4"
          gutterBottom
          style={{ fontWeight: "bold", marginTop: "40px" }}
        >
          Activity On ArtHub
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="List Activity" />
            <Tab label="List All Transactions" />
            <Tab label="List Payment" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <TableContainer
            component={Paper}
            style={{ marginBottom: "50px", marginTop: "40px" }}
          >
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Owner</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Activity</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>User Interact</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>{activity.ownerName}</TableCell>
                    <TableCell>{activity.activityName}</TableCell>
                    <TableCell>{activity.userInteract}</TableCell>
                    <TableCell>
                      {moment(activity.activityDate).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]}
              component="div"
              count={activityTotal}
              rowsPerPage={rowsPerPage}
              page={activityPage}
              onPageChange={(e, newPage) => handlePageChange(0, newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <TableContainer
            component={Paper}
            style={{ marginBottom: "50px", marginTop: "40px" }}
          >
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Transaction ID</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Seller</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Buyer</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Artwork ID</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction._id}</TableCell>

                    {/* Seller */}
                    <TableCell>
                      <Box
                        onClick={() =>
                          handleUserClick(transaction.sellerID._id! as string)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Avatar
                          src={
                            typeof transaction.sellerID === "object"
                              ? transaction.sellerID.profilePicture
                              : undefined
                          }
                        />
                        {typeof transaction.sellerID === "object"
                          ? `${transaction.sellerID.firstName || ""}  ${transaction.sellerID.lastName || ""
                          }`
                          : "Unknown"}
                      </Box>
                    </TableCell>

                    {/* Buyer */}
                    <TableCell>
                      <Box
                        onClick={() =>
                          handleUserClick(transaction.buyerID._id! as string)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Avatar
                          src={
                            typeof transaction.buyerID === "object"
                              ? transaction.buyerID.profilePicture
                              : undefined
                          }
                        />
                        {typeof transaction.buyerID === "object"
                          ? `${transaction.buyerID.firstName || ""} ${transaction.buyerID.lastName || ""
                          }`
                          : "Unknown"}
                      </Box>
                    </TableCell>

                    {/* Artwork */}
                    <TableCell
                      onClick={() =>
                        handleArtworkClick(transaction.artworkID._id!)
                      }
                      sx={{
                        cursor: "pointer",
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      {typeof transaction.artworkID === "object"
                        ? transaction.artworkID._id
                        : transaction.artworkID}
                    </TableCell>

                    <TableCell>${transaction.price}</TableCell>
                    <TableCell>
                      {moment(transaction.dateToBuy).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]} // Add options
              component="div"
              count={transactionTotal} // Use total from API
              rowsPerPage={rowsPerPage}
              page={transactionPage}
              onPageChange={(e, newPage) => handlePageChange(1, newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <TableContainer
            component={Paper}
            style={{ marginBottom: "50px", marginTop: "40px" }}
          >
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#0b81ff" }}>
                  <TableCell style={{ color: "white" }}>
                    <strong>Payment code </strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>User</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Amount</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell style={{ color: "white" }}>
                    <strong>Created At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.dateCreated}>
                    <TableCell>{payment.orderCode}</TableCell>
                    <TableCell>
                      <Box
                        onClick={() =>
                          handleUserClick(payment.userId._id! as string)
                        }
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        <Avatar src={payment.userId?.profilePicture} />
                        {payment.userId.firstName} {payment.userId.lastName}
                      </Box>
                    </TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={payment.status === true ? "Success" : "Failed"}
                        color={payment.status === true ? "success" : "error"}
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell>
                      {moment(payment.dateCreated).format(
                        "YYYY-MM-DD hh:mm:ss "
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 50]} // Add options
              component="div"
              count={paymentTotal}
              rowsPerPage={rowsPerPage}
              page={paymentPage}
              onPageChange={(e, newPage) => handlePageChange(2, newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </TabPanel>
      </Container>
    </>
  );
}
