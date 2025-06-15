import { createContext } from "react";

const LoginContext = createContext({
  login: () => {},
  logout: () => {},
  loggedIn: false,
  isAuthChecked: false,
  setIsAuthChecked: () => {},
});

export default LoginContext;
