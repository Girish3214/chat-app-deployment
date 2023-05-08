import Container from "@mui/material/Container";
import RouterComponent from "./components/RouterComponent";
import NavBar from "./components/NavBar";
import { Backdrop, CircularProgress } from "@mui/material";
import { useGlobalContext } from "./store/authContext";
import { AppChatProvider } from "./store/chatContext";

function App() {
  const { loading, user } = useGlobalContext();
  return (
    <AppChatProvider user={user}>
      {
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
      <NavBar />
      <Container component={"main"} maxWidth="xl" sx={{ height: "85%" }}>
        <RouterComponent />
      </Container>
    </AppChatProvider>
  );
}

export default App;
