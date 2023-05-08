import React from "react";
import { Alert, Box, Snackbar } from "@mui/material";

const AlertMsg = ({ message, open, handleClose }) => {
  return (
    <Box spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={message}
        sx={{ top: "100px !important" }}
      >
        <Alert
          open={open}
          onClose={handleClose}
          severity="info"
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AlertMsg;
