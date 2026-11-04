import React, { useContext } from "react";
import { Container, Grid, Typography, IconButton, Button } from "@mui/material";
import { ThemeContext } from "../Themes/ThemeProvider.tsx";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "../../css/Footer.css";

export default function Footer() {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className="footer" style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
      <Container className="footer-container">
        <Grid container spacing={4}>
          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Contact Us</Typography>
              <div className="footer-content">
                <Typography className="contact-item">
                  <EmailIcon className="contact-icon" />
                  arthubsupport@gmail.com
                </Typography>
                <Typography className="contact-item">
                  <PhoneIcon className="contact-icon" />
                  +84 (035) 6759 177
                </Typography>
                <Typography className="contact-item">
                  <LocationOnIcon className="contact-icon" />
                  FPT University | Da Nang
                </Typography>
              </div>
            </div>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Follow Us</Typography>
              <div className="footer-content">
                <Typography style={{ marginBottom: "16px" }}>Connect with us on social media</Typography>
                <div className="social-links">
                  <IconButton
                    className="social-icon"
                    href="https://facebook.com/namson03"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    className="social-icon"
                    href="https://instagram.com/namson.10"
                    target="_blank"
                    style={{ color: theme.color }}>
                    <InstagramIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </Grid>

          {/* Contact Button Section */}
          <Grid item xs={12} md={4}>
            <div className="footer-section">
              <Typography className="footer-heading">Contact Us</Typography>
              <div className="footer-content">
                <Typography style={{ marginBottom: "16px" }}>Click below to send us an email</Typography>
                <Button
                  variant="contained"
                  href="mailto:namson1821@gmail.com"
                  style={{
                    backgroundColor: `rgba(${theme.rgbBackgroundColor}, 0.5)`,
                    color: theme.color,
                  }}>
                  Contact Us
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <Typography>© {new Date().getFullYear()} Artix. All rights reserved.</Typography>
        </div>
      </Container>
    </footer>
  );
}
