import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./message.module.css";
import LoginContext from "../../context/context.js";
import axios from "axios";
import Chhat from "./Chhat.js";
import { Logo } from "../images/Logo.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function LoaderRipple() {
  return (
    <div className={styles["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
}

function Messagee() {
  const [chatId, setChatId] = useState(null);
  const navigate = useNavigate();
  const { logout, loggedIn } = useContext(LoginContext);
  const mainRef = useRef();
  const [chat, setChat] = useState([]);
  const [chatState, setChatState] = useState("busy");
  const [chatInit, setChatInit] = useState(false);
  const [message, setMessage] = useState("");
  let ws = useRef(null);

  useEffect(() => {
    if (mainRef.current) {
      const container = mainRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    if (!loggedIn) {
      setChat([]);
      setChatInit(true); 
      setChatState("idle"); 
      setChatId(null);
    }
  }, [loggedIn]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.get(
            "https://backend-server-chi-nine.vercel.app/chat",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}` // ✅ Send token
              }
            }
          );

        console.log("chatid", data);
        setChatId(data.data.chatId);
        console.log("chat id", data.data.chatId);
        
        // Handle chat history fallback from HTTP response
        if (data.data.chatHistory && data.data.chatHistory.length > 0) {
          console.log("Loading chat history from HTTP response");
          let updatedChat = [];
          for (let conv of data.data.chatHistory) {
            if (conv.prompt) {
              updatedChat.push({ message: conv.prompt, own: true });
            }
            if (conv.response) {
              updatedChat.push({ message: conv.response, own: false });
            }
          }
          setChat(updatedChat);
          setChatState("idle");
          setChatInit(true);
        }
      } catch (error) {
        console.log("Error Fetching Data", error);
        // Added: Set chatInit to true even on error so UI doesn't stay loading
        setChatInit(true);
        setChatState("idle");
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("ChatId updated:", chatId);

    if (chatId !== null) {
      let wss = new WebSocket(`wss://websocket-server-6mtr.onrender.com?id=${chatId}&isServer=false`);
      ws.current = wss;
      console.log("wss", wss);
      
      wss.addEventListener("open", () => {
        console.log("Websocket connected");
        ws.current.send(JSON.stringify({ type: "client:connected" }));
        ws.current.send(JSON.stringify({ type: "client:chathist" }));
      });

      wss.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data?.type === "server:chathist") {
          const histdata = data?.data;
          if (!histdata) return;

          let updatedChat = [];
          for (let conv of histdata) {
            if (conv.prompt) {
              updatedChat.push({ message: conv.prompt, own: true });
            }
            if (conv.response) {
              updatedChat.push({ message: conv.response, own: false });
            }
          }
          console.log("updatechat", updatedChat);
          setChat(updatedChat);
          setChatState("idle");
          setChatInit(true);
        } else if (data?.type === "server:response:start") {
          // Added: Initialize empty message for streaming
          setChat((prevChat) => [
            ...prevChat,
            { message: "", own: false, isLoading: true },
          ]);
        } else if (data?.type === "server:response:chunk") {
          setChat((prevchat) => {
            return [
              ...prevchat.slice(0, -1),
              {
                message: `${prevchat.at(prevchat.length - 1).message}${
                  data.chunk
                }`,
                own: false,
                isLoading: true,
              },
            ];
          });
        } else if (data?.type === "server:response:end") {
          setChat((prevChat) => {
            const lastMessage = prevChat[prevChat.length - 1];
            if (lastMessage) {
              lastMessage.isLoading = false;
            }
            return [...prevChat];
          });
          setChatState("idle");
        } else if (data?.type === "server:response:restricted") {
          setChat((prevChat) => [
            ...prevChat,
            { message: data.message, own: false, isLoading: false },
          ]);
          setChatState("idle");
        }
      });

      // Added: Error handling for WebSocket
      wss.addEventListener("error", (error) => {
        console.error("WebSocket Error:", error);
      });

      wss.addEventListener("close", () => {
        console.log("WebSocket connection closed.");
      });

      return () => {
        // Fixed: Check if WebSocket exists before closing
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.close();
        }
      };
    } else {
      console.log("not chat id searching for chat id");
    }
  }, [chatId]);

  useEffect(() => {
    console.log("Chat messages:", chat);
  }, [chat]);

  const handleClick = () => {
    if (!message.trim()) return;
    
    // Added: Check if WebSocket is connected before sending
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket not connected");
      return;
    }

    setChat((prevChat) => [
      ...prevChat,
      { message, own: true, isLoading: false },
    ]);
    ws.current.send(
      JSON.stringify({
        type: "client:prompt",
        prompt: message,
      })
    );
    setMessage("");
    setChatState("busy");
  };

  const logoutUser = async () => {
  try {
    const response = await axios.get(
      "https://backend-server-chi-nine.vercel.app/logout",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      }
    );

    // Check for successful response (status 200)
    if (response.status === 200) {
      localStorage.removeItem("authToken");
      logout(); // update context
    }
  } catch (error) {
    console.log("Error in logout", error);
    // Even if backend call fails, clean up locally
    localStorage.removeItem("authToken");
    logout();
  }
};

  return (
    <div className={styles.messageContainer}>
      <header>
        <div className={styles.logoContainer} onClick={() => navigate("/")}>
          <Logo />
          <div className={styles.headerText}>
            <h4>MindMaple</h4>
            <h6>A mental health chat assistance</h6>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button onClick={() => navigate(loggedIn ? "/analysis" : "/login")}>
            <i
              className="fas fa-chart-bar"
              style={{ fontSize: "20px", paddingRight: "10px" }}
            ></i>
            Analyse
          </button>

          <button onClick={loggedIn ? logoutUser : () => navigate("/login")}>
            <FontAwesomeIcon
              icon={loggedIn ? faSignOutAlt : faArrowLeft}
              style={{ fontSize: "20px", paddingRight: "10px" }}
            />
            {loggedIn ? "LogOut" : "Login"}
          </button>
        </div>
      </header>

      <main
        ref={mainRef}
        style={
          !chatInit || chat.length === 0
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            : {}
        }
      >
        {!chatInit && (
          <div className={styles.loadingChatInit}>
            <LoaderRipple />
          </div>
        )}
        {chatInit && chat.length === 0 && (
          <div className={styles.emptyChat}>
            No Previous Chat History! <br />
            Start a new conversation.
          </div>
        )}
        {chatInit &&
          chatId &&
          chat.map((message, index) => (
            <Chhat
              key={index}
              text={message.message}
              own={message.own}
              isLoading={message.isLoading}
            />
          ))}
      </main>

      <footer>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleClick}
            disabled={chatState === "busy"}
          >
            <span className="material-symbols-outlined">
              <i
                className="fas fa-paper-plane"
                style={{ fontSize: "38px", color: "black" }}
              ></i>
            </span>
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Messagee;