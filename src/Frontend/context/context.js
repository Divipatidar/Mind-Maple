import { createContext } from "react";

const LoginContext = createContext({
    login: () => {},
    logout: () => {},
    loggedIn: false,
  })

export default LoginContext
