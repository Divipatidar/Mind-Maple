import "./App.css";
import Home from "./Frontend/Pages/homePage/Home.js";
import Login from "./Frontend/Pages/LoginPage/Login.js";
import { PrivateRoute } from "./Frontend/Componenets/router/routter.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRouteAnalysis } from "./Frontend/Componenets/router/analysisrouter.js";
import Analylis from "./Frontend/Pages/analylis/Analylis.js";
import Error from "./Frontend/Pages/error/Error.js";
import Messagee from "./Frontend/Pages/message/Messagee.js";
import { useContext, useEffect } from "react";
import LoginContext from "./Frontend/context/context.js";
import axios from "axios";

function App() {
  const { login, logout, loggedIn, setIsAuthChecked, isAuthChecked } =
    useContext(LoginContext);

  console.log(
    "App render - loggedIn:",
    loggedIn,
    "isAuthChecked:",
    isAuthChecked
  );

  useEffect(() => {
    async function isUser() {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const user = await axios.get("https://backend-server-chi-nine.vercel.app/isUser", {
            headers,
            withCredentials: true,
          });
          if (user) {
            console.log("Token verified - user is authenticated");
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            login();
          } else {
            console.log("Token invalid - logging out");
            logout();
          }
        } else {
          console.log("No token found");
          logout();
        }
      } catch (error) {
        console.log("Auth check error:", error.message);
        if (error.response?.status === 401) {
          console.log("401 error - invalid token");
          localStorage.removeItem("authToken");
          logout();
        }
      } finally {
        setIsAuthChecked(true);
      }
    }

    if (!isAuthChecked) {
      isUser();
    }
  }, [login, logout, setIsAuthChecked, isAuthChecked]);

  if (!isAuthChecked) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/message" element={<Messagee />} />
        <Route
          path="/analysis"
          element={
            <PrivateRouteAnalysis>
              <Analylis />
            </PrivateRouteAnalysis>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
