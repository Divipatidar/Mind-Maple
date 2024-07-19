import { useState } from "react"
import LoginContext from "./context.js"

const ContextProvider = ({children})=>{
    const [loggedIn,setLoggedIn] = useState(false);
    function login(){
        console.log("Login function called");
        setLoggedIn(true);
    }
    function logout(){
        console.log("Logout function called");
        setLoggedIn(false);
    }

    return (
        <LoginContext.Provider value={{login,logout,loggedIn}} >
            {children}
        </LoginContext.Provider>
    )
}

export default ContextProvider