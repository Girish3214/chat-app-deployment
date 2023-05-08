import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import axios from "../../uitils/baseAxios";
import { loginApi } from "../../uitils/apiUrls";
import AlertMsg from "../../components/AlertMsg";
import { useGlobalContext } from "../../store/authContext";

const initialData = {
  email: "",
  password: "",
};
const initialErrorData = {
  email: false,
  password: false,
};

const LoginPage = () => {
  const { loginUser, loginError, setLoginError } = useGlobalContext();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState(initialErrorData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    const { email, password } = formData;
    e.preventDefault();
    if (!email || !password) {
      setErrors({
        email: email === "",
        password: password === "",
      });
      return;
    }
    const res = await loginUser(formData);
    if (res) {
      setErrors(initialErrorData);
      setFormData(initialData);
    }
  };
  return (
    <>
      {loginError && (
        <AlertMsg
          open={loginError.error}
          message={loginError.msg}
          handleClose={() => setLoginError(null)}
        />
      )}

      <Container component="main" maxWidth="xs" sx={{ paddingTop: "4rem" }}>
        <Paper
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 4,
          }}
          elevation={5}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              error={errors.email}
              helperText={errors.email && "Email is required"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => handleInputChange(e)}
              error={errors.password}
              helperText={errors.password && "Password is required"}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
