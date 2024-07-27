import React, { useContext, useEffect, useState } from "react";
import InputBox from "../../Componenets/inputbox/InputBox.js";
import Button from "../../Componenets/button/Button.js";
import {
  LoginWithEmail,
  LoginWithGoogle,
  SignupWithEmail,
} from "../../Firebase/firebase.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoginContext from "../../context/context.js";
import styles from "./login.module.css";
import axios from "axios";

function Login() {
  const [isRegistered, setIsRegister] = useState(true);
  const [isLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [, setLoginError] = useState(false);
  const [, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);
  useEffect(() => {
    if (isRegistered === true) {
      setError({
        email: "",
        password: "",
      });
    } else {
      setError({
        name: "",
        email: "",
        password: "",
      });
    }
  }, [isRegistered]);

  const handleLoginDataChange = (e, text) => {
    setLoginError(false)
    const change = e.target.value;
    setLoginData((d) => {
      d[text] = change;
      return { ...d };
    });
  };

  const handleLoginWithGoogle =  () => {
    async function loginGoogle(){
      try {
        const res = await LoginWithGoogle();
        if(res){
          setLoggedIn(true);
        }
      } catch (error) {
        
      }
    }
    loginGoogle();
    
  }
  const LoginandSignup = async (e) => {
    try {
      if (isRegistered) {
        const login = await LoginWithEmail(loginData.email, loginData.password);
        console.log(login);
        const { credential, token } = login; // Destructure the result to get credential and token
        localStorage.setItem('authToken', token);

        const headers = {
          token: "Bearer " + token,
        };
    
        await axios.post('https://backend-server-chi-nine.vercel.app/login', {}, {
          headers,
          withCredentials: true,
        });
        setLogging(false);
        setLoggedIn(true);
      } else {
        const Signup = await SignupWithEmail(
          loginData.email,
          loginData.password
        );
        console.log(Signup);
        setLogging(false);
        setLoggedIn(true);
      }
    } catch (error) {
      setLoginError(true);
      if(isRegistered)
      toast.error("Invalid credentials", {
        position: "top-right"
      });
      else{
       
      toast.error("Error creating account", {
        position: "top-right"
      });
      }
      //return;
      setErrorMessage(error.message)
      setLogging(false);
    }
  };
  const handleSubmitButton = (e) => {
    e.preventDefault();
    //first check for errors and then only update the error and if the error is empty send a request

    if (!isRegistered) {
      if (loginData.email==="" || loginData.password==="") {
        toast.error("Please enter all the fields", {
          position: "top-right"
        });
        return ;
      }
     
    }

    if (isRegistered && (loginData.email==="" || loginData.password==="")) {
      toast.error("Please enter all the fields", {
        position: "top-right"
      });
      return;
    }
    else {
      const isCorrectMail = loginData.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        if (!isCorrectMail) {
          toast.error("please enter a correct email", {
            position: "top-right"
          });
          return;
        }
        else if (!isRegistered && loginData.password.length < 8) {
          toast.error("please enter a longer password", {
            position: "top-right"
          });
          return;
        } 
      
    }

    
    setLogging(true);
    // calling the request
    LoginandSignup();
  };
  useEffect(() => {
    
    if (loggedIn){ 
      login()
      navigate("/message")};
  }, [loggedIn]);
  useEffect(() => {
    if (Object.keys(error).length === 0) {
    }
  }, [error]);
  return (
    <div className={styles.pageContainer}>
         <ToastContainer />
      <div className={styles.pageContent}>
        <div className={styles.leftContainer}>
          <div className={styles.loginContainer} onSubmit={handleSubmitButton}>
            <header>
              {isRegistered ? (
                <h2>
                  Welcome Back <span>👋</span>
                </h2>
              ) : (
                <h2>
                  Register a New Account <span>👇</span>
                </h2>
              )}
            </header>
            <main>
              <InputBox
                label="Email"
                name="email"
                type="email"
                disabled={isLoading}
                value={loginData.email}
                handleChange={handleLoginDataChange}
                placeholder="example@email.com"
              />

              <InputBox
                label="Password"
                name="password"
                type="password"
                disabled={isLoading}
                value={loginData.password}
                handleChange={handleLoginDataChange}
                placeholder="At least 8 characters"
              />

              <Button
                text={isRegistered ? "Sign in" : "Sign up"}
                type="submit"
                handleClick={handleSubmitButton}
                logging={logging}
                style={{
                  backgroundColor: isRegistered
                    ? "rgb(144, 0, 64)"
                    : "rgb(0, 144, 101)",
                }}
              />
              <div className="text-center mt-2 opacity-70">
                <span style={{ font: `'Inter', sans-serif ` }}>OR</span>
              </div>
              <div className={styles.googleButton}
                onClick={() => {
                  handleLoginWithGoogle();
                }}>
                    <img src={"data:image/png;base64,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"} 
                    alt="" className={styles.googleImage} />
                <div>{isRegistered ? "Sign in " : "Sign up "}with Google</div>
              </div>
            </main>
            <footer>
              {isRegistered
                ? `Don't have an account?`
                : `Already have an account?`}{" "}
              {
                <span
                  onClick={() => {
                    setIsRegister((value) => !value);
                    setLoginData({
                      name: "",
                      email: "",
                      password: "",
                    });
                  }}
                >
                  {isRegistered ? "Sign up" : "Sign in"}
                </span>
              }
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
