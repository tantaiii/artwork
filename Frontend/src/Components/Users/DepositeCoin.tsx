import React, { useContext, useEffect, useRef, useState } from "react";

import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import { Box, Fade, Popper } from "@mui/material";
import "../../css/ArtShop.css";
import PaymentArea from "./../StyledMUI/PaymentArea.tsx";
import Customized3DModel from "../StyledMUI/Customized3DModel.tsx";
import CustomizedPopperPayment from "../StyledMUI/CustomizedPopperPayment.tsx";

export default function DepositeCoin() {
  const { theme, dark } = useContext(ThemeContext);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  return (
    <>
      <Popper open={showPayment ? true : false} transition>
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps}>
            <Box>
              <CustomizedPopperPayment amount={amount} />
            </Box>
          </Fade>
        )}
      </Popper>
      <div
        className="formup"
        style={{
          backgroundImage: "url('/images/animation_simple_box_red.gif')",
          backgroundSize: "cover",
          height: "100vh",
          position: "relative",
        }}
      >
        <PaymentArea setShowPayment={setShowPayment} />
        <Customized3DModel />
      </div>
    </>
  );
}
