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
          console.log("🔑 Token found, checking authentication...");
          
          const headers = {
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.get(
            "https://backend-server-chi-nine.vercel.app/isUser",
            { headers }
          );

          if (response && response.data && response.status === 200) {
            console.log("Token verified - user is authenticated", response.data);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            login();
          } else {
            console.log(" Invalid response - logging out");
            localStorage.removeItem("authToken");
            logout();
          }
        } else {
          console.log("No token found - logging out");
          logout();
        }
      } catch (error) {
        console.error("Auth check error:", error.message);

        if (error.response?.status === 401) {
          console.log("401 Unauthorized - removing token");
          localStorage.removeItem("authToken");
          delete axios.defaults.headers.common["Authorization"];
          logout();
        } else {
          console.log("Network or other error - logging out");
          localStorage.removeItem("authToken");
          delete axios.defaults.headers.common["Authorization"];
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