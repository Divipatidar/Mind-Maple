import { useState } from "react";
import LoginContext from "./context.js";

const ContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("authToken");
    return !!token;
  });

  const [isAuthChecked, setIsAuthChecked] = useState(false);

  function login() {
    console.log("Login function called");
    setLoggedIn(true);
    setIsAuthChecked(false);
  }

  function logout() {
    console.log("Logout function called");
    setLoggedIn(false);
    localStorage.removeItem("authToken");
    setIsAuthChecked(true); 
  }

  return (
    <LoginContext.Provider
      value={{
        login,
        logout,
        loggedIn,
        isAuthChecked,
        setIsAuthChecked,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default ContextProvider;
