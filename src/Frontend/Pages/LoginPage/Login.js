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
    setLoginError(false);
    const change = e.target.value;
    setLoginData((d) => {
      d[text] = change;
      return { ...d };
    });
  };

  const handleLoginWithGoogle = async () => {
    try {
      setLogging(true);
      const result = await LoginWithGoogle();
      if (result) {
        setLoggedIn(true);
      }
    } catch (error) {
      toast.error("Google login failed", {
        position: "top-right",
      });
    } finally {
      setLogging(false);
    }
  };

  const LoginandSignup = async () => {
  try {
    if (isRegistered) {
      // 🔐 Login with Firebase
      const loginResult = await LoginWithEmail(
        loginData.email,
        loginData.password
      );
      const { credential, token } = loginResult;

      // 🔁 Send Firebase token to backend login route
      const response = await axios.post(
        "https://backend-server-chi-nine.vercel.app/login",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send Firebase token
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // ✅ Store backend JWT token
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
        setLoggedIn(true);
      }
    } else {
      // 🔐 Signup with Firebase
      const signupResult = await SignupWithEmail(
        loginData.email,
        loginData.password
      );

      // ✅ Backend token already stored in SignupWithEmail
      if (signupResult) {
        setLoggedIn(true);
      }
    }
  } catch (error) {
    setLoginError(true);
    if (isRegistered) {
      toast.error("Invalid credentials", {
        position: "top-right",
      });
    } else {
      toast.error("Error creating account", {
        position: "top-right",
      });
    }
    setErrorMessage(error.message);
  } finally {
    setLogging(false);
  }
};

  useEffect(() => {
    if (loggedIn) {
      login();
      navigate("/message");
    }
  }, [loggedIn, login, navigate]);

  return (
    <div className={styles.pageContainer}>
      <ToastContainer />
      <div className={styles.pageContent}>
        <div className={styles.leftContainer}>
          <div className={styles.loginContainer}>
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
              <form onSubmit={handleSubmitButton}>
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
              </form>

              <div className="text-center mt-2 opacity-70">
                <span style={{ font: `'Inter', sans-serif` }}>OR</span>
              </div>

              <div
                className={styles.googleButton}
                onClick={handleLoginWithGoogle}
              >
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAABL1BMVEX////qQzU0qFNChfT7vAVpmvY4gPRIiPT7ugDf6P3qQTPqPS4vp1D7uAAnpUvqPzDqOSn+897p7/363dvpNSP1t7P++fn7xkr/+e2v2LjrTD/98fD51dPpLxv8wQD92pn2+f94pPfs9e5PsGdzvoQAnznzo57tY1nwhH3ud2/oJQrsXVLymZTrUkbxkYvoGQD3pxXpNDfuZC0mefP+79P80HmhvvnV4fy0yvpYkfXZ7N3L5dHH1/sAmyyh0qxdtXL3xMHubWT4vI/nFiT6uiz1kxn94KfyhiP8ymrxeCj2nhvtWS/6zbT+6cKLr/j8yVnNsADS3bW5tC+jsTiErkFjq0nouhfKtintvTPL1JyNyZphqqw3notAjN4AcPMvqjY9lL86m5syoHg3jsc3lazkeRqDAAAGOElEQVR4nO2aCXPaRhSAhSwTgsSiGKSEywdC5jIojuMcYANpc7aNkzpXS9OkTfr/f0NXAhOBdoUkw2qZed+MZzweS7Of37H7FgsCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPM/ecy4mI5oxHPDZwPzoFcZ4XDYMYxIR/M1wWBsX+psUk3mqvX6/4NDv96ub6wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPM/ecy4+r6RzmAAAAAASUVORK5CYII="
                  alt=""
                  className={styles.googleImage}
                />
                <div>{isRegistered ? "Sign in " : "Sign up "}with Google</div>
              </div>
            </main>
            <footer>
              {isRegistered
                ? `Don't have an account?`
                : `Already have an account?`}{" "}
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
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
