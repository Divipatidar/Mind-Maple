import { useContext } from "react";
import LoginContext from "../../context/context.js";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { loggedIn, isAuthChecked } = useContext(LoginContext);

  if (!isAuthChecked) {
    return <div>Loading...</div>;
  }

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};
