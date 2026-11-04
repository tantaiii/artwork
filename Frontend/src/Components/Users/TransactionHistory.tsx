import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import "../../css/TransactionHistory.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import { styled } from "@mui/material/styles";
import { Chip } from "@mui/material"; // Bỏ Button/TextField nếu không dùng form
import {
  OrderDetailsExtended,
  OrderHeader,
} from "../../Interfaces/OrderInterfaces.ts";
import { Creator } from "../../Interfaces/UserInterface.ts";
import { Payment } from "../../Interfaces/PaymentIntrerfaces.ts";
import { User } from "../../Interfaces/UserInterface.ts";
import { Artwork } from "../../Interfaces/ArtworkInterfaces.ts";
import { GetPaymentAPI } from "../../API/PaymentAPI/GET.tsx";
import { GetTransactionApi } from "../../API/TransactionAPI/GET.tsx";
import { ApiResponse } from "../../Interfaces/app.common.ts";
import { useAuth } from "../../secure/AuthContext.tsx";

// Updated interface match backend response

interface Transaction {
  _id: string;
  price: number;
  dateToBuy?: string; // String ISO từ backend
  buyerID: User; // Populated object
  sellerID: User;
  artworkID: Artwork;
}

interface TransactionTableProps {
  transactions: Transaction[];
  total: number;
  onRedirect: (artworkId: string) => void; // _id string
  currentPage: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  theme: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
          <Typography>{children}</Typography>
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

export default function TransactionHistory() {
  const [value, setValue] = useState(0);
  const handleChange = (event: any, newValue: any) => setValue(newValue);

  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  // Bỏ unused: orderBy*, orderHeader, checkTransCode, loadingButton, isChecked (nếu không dùng form)

  const [buyerTransactions, setBuyerTransactions] = useState<Transaction[]>([]);
  const [sellerTransactions, setSellerTransactions] = useState<Transaction[]>(
    []
  );
  const [buyerTotal, setBuyerTotal] = useState(0);
  const [sellerTotal, setSellerTotal] = useState(0);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsTotal, setPaymentsTotal] = useState(0);

  const navigate = useNavigate();

  // API hooks
  const { getPaymentByUserID } = GetPaymentAPI();
  const { getTransactionByBuyerId, getTransactionBySellerId } =
    GetTransactionApi();

  // Initial check
  useEffect(() => {
    if (!user?._id) console.error("User not logged in");
  }, [user?._id]);

  // Reset page on tab change
  useEffect(() => {
    setCurrentPage(0);
  }, [value]);

  // Fetch data
  useEffect(() => {
    if (!user?._id) return;

    setLoading(true);
    const fetchCurrentTab = async () => {
      try {
        const actualPage = currentPage + 1;

        if (value === 0) {
          // Bought - Fix call + destructuring
          const res = await getTransactionByBuyerId(actualPage, rowsPerPage);
          const apiRes = res as ApiResponse;
          setBuyerTransactions(apiRes.data?.transactions || []);
          setBuyerTotal(apiRes.data?.totalItems || 0);
        } else if (value === 1) {
          // Sold
          const res = await getTransactionBySellerId(actualPage, rowsPerPage);
          const apiRes = res as ApiResponse;
          setSellerTransactions(apiRes.data?.transactions || []);
          setSellerTotal(apiRes.data?.totalItems || 0);
        } else if (value === 2) {
          // Payments
          const res = await getPaymentByUserID(actualPage, rowsPerPage);
          const apiRes = res as ApiResponse;
          setPayments(apiRes.data?.payments || []);
          setPaymentsTotal(apiRes.data?.totalItems || apiRes.data?.total || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTab();
  }, [value, currentPage, rowsPerPage, user?._id]);

  // Bỏ lazy fetch - populated already

  const redirect = (artID: string) => navigate(`/characters/artwork/${artID}`);

  const handleChangePage = (event: any, newPage: any) =>
    setCurrentPage(newPage);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  const paginationOptions = [5, 10, 25];

  const BoughtTransactionsTable: React.FC<TransactionTableProps> = ({
    transactions,
    total,
    onRedirect,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    theme,
  }) => (
    <TableContainer
      component={Paper}
      style={{ marginBottom: "50px", marginTop: "40px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <StyledTableCell style={{ color: "white" }} align="left">
              Buyer
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Seller
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Date
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Price
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Artwork
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: theme.color }}>
                  No purchased artworks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <StyledTableRow key={transaction._id}>
                <StyledTableCell align="left">
                  {transaction.buyerID.firstName}{" "}
                  {transaction.buyerID.lastName || ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.sellerID.firstName}{" "}
                  {transaction.sellerID.lastName || ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.dateToBuy?.split("T")[0] || "N/A"}{" "}
                  {/* Fix field + safe */}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.price} Coins
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: theme.color,
                      width: "auto",
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" },
                    }}
                    onClick={() => onRedirect(transaction.artworkID._id!)}
                  >
                    View
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={paginationOptions}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const SoldTransactionsTable: React.FC<TransactionTableProps> = ({
    transactions,
    total,
    onRedirect,
    currentPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    theme,
  }) => (
    <TableContainer
      component={Paper}
      style={{ marginBottom: "50px", marginTop: "40px" }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow style={{ backgroundColor: "#0b81ff" }}>
            <StyledTableCell style={{ color: "white" }} align="left">
              Seller
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Buyer
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Date
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Price
            </StyledTableCell>
            <StyledTableCell style={{ color: "white" }} align="left">
              Artwork
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" sx={{ color: theme.color }}>
                  No sold artworks found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <StyledTableRow key={transaction._id}>
                <StyledTableCell align="left">
                  {transaction.sellerID.firstName}{" "}
                  {transaction.sellerID.lastName || ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.buyerID.firstName}{" "}
                  {transaction.buyerID.lastName || ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.dateToBuy?.split("T")[0] || "N/A"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {transaction.price} Coins
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: theme.color,
                      width: "auto",
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" },
                    }}
                    onClick={() => onRedirect(transaction.artworkID!._id!)}
                  >
                    View
                  </Typography>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={paginationOptions}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="transaction">
        <Box
          className="box"
          sx={{
            color: theme.color,
            backgroundColor: `rgba(${theme.rgbBackgroundColor},0.97)`,
            transition: theme.transition,
            width: "85%",
            margin: "auto",
            borderRadius: "5px",
            marginBottom: "15px",
            minHeight: "700px",
          }}
        >
          <h1>Transaction History:</h1>
          <Box sx={{ width: "90%", margin: "auto" }}>
            <Box sx={{ borderBottom: 1, borderColor: theme.color3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <ShoppingCartIcon
                        style={{ transform: "translateY(-5px)" }}
                      />
                      Bought Artworks History
                    </div>
                  }
                  {...a11yProps(0)}
                />
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <AttachMoneyIcon
                        style={{ transform: "translateY(-5px)" }}
                      />
                      Sold Artworks History
                    </div>
                  }
                  {...a11yProps(1)}
                />
                <Tab
                  label={
                    <div style={{ display: "flex", color: theme.color2 }}>
                      <CurrencyExchangeIcon
                        style={{ transform: "translateY(-5px)" }}
                      />
                      Deposit Coin History
                    </div>
                  }
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <BoughtTransactionsTable
                transactions={buyerTransactions}
                total={buyerTotal}
                onRedirect={redirect}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                theme={theme}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <SoldTransactionsTable
                transactions={sellerTransactions}
                total={sellerTotal}
                onRedirect={redirect}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                theme={theme}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <TableContainer
                component={Paper}
                style={{ marginBottom: "50px", marginTop: "40px" }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#0b81ff" }}>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Transaction Code
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Amount ($coin)
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Deposit Date
                      </StyledTableCell>
                      <StyledTableCell style={{ color: "white" }} align="left">
                        Status
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.length > 0 ? (
                      payments.map((payment, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell align="left">
                            {payment.orderCode || "N/A"}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {payment.amount}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {payment.dateCreated?.split("+")[0] || "N/A"}{" "}
                            {/* Safe */}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            <Chip
                              label={
                                payment.status === true ? "Success" : "Failed"
                              }
                              color={
                                payment.status === true ? "success" : "error"
                              }
                              variant="outlined"
                              sx={{ fontWeight: "bold" }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        <StyledTableCell align="center" colSpan={4}>
                          don't have any deposit transactions yet
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </TableBody>
                </Table>
                <Box
                  display="flex"
                  justifyContent="end"
                  alignItems="center"
                  my={1}
                >
                  <TablePagination
                    rowsPerPageOptions={paginationOptions}
                    component="div"
                    count={paymentsTotal}
                    rowsPerPage={rowsPerPage}
                    page={currentPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Box>
              </TableContainer>
            </CustomTabPanel>
          </Box>
        </Box>
      </div>
    </>
  );
}
