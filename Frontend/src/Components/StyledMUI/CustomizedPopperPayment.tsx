import React, { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import "../StyledMUI/css/CustomizedPopperPayment.css";
import { Card } from "@mui/material";
export default function CustomizedPopperPayment({
  amount,
}: {
  amount: number;
}) {
  const navigate = useNavigate();

  return (
    <div className="backdrop">
      <Card className="card-payment">
        <div className="card-info">
          <Grid container spacing={2}>
            <img className="img-noti" src="/images/payment.gif" />

            <Grid item xs={12}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                className="text-payment-successfully"
                sx={{ pt: 0, mt: -8 }}
              >
                Payment Successfully!
              </Typography>
            </Grid>
            <Grid item xs={12} className="text-amount">
              <Typography variant="h3" component="h1" gutterBottom>
                +{amount}$
              </Typography>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              {/* <Button
                variant="contained"
                color="success"
                className="button-payment"
                onClick={() => handleOnclick()}
              >
                Go to Main Page!
              </Button> */}
            </Grid>
          </Grid>
        </div>
      </Card>
    </div>
  );
}
