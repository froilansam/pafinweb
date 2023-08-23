import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./screens/login";
import SignUp from "./screens/signup";
import { observer } from "mobx-react-lite";
import { useAuthStore } from "./stores/AuthStore";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { token } = useAuthStore();
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            Component={() => (token ? <Dashboard /> : <SignIn />)}
          />
          <Route path="/signup" Component={SignUp} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default observer(App);
