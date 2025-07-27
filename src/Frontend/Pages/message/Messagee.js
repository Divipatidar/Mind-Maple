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
            "http://localhost:8000/chat",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}` // ✅ Send token
              }
            }
          );

        console.log("chatid", data);
        console.log("Full response data:", data.data); // Added debug log
        setChatId(data.data.chatId);
        console.log("chat id", data.data.chatId);
        
        // Handle chat history fallback from HTTP response
        if (data.data.chatHistory && data.data.chatHistory.length > 0) {
          console.log("Loading chat history from HTTP response");
          console.log("Chat history array:", data.data.chatHistory); // Added debug log
          let updatedChat = [];
          for (let conv of data.data.chatHistory) {
            console.log("Processing conversation:", conv); // Added debug log
            if (conv.prompt) {
              updatedChat.push({ message: conv.prompt, own: true, isLoading: false }); // Added isLoading
            }
            if (conv.response) {
              updatedChat.push({ message: conv.response, own: false, isLoading: false }); // Added isLoading
            }
          }
          console.log("Final updatedChat:", updatedChat); // Added debug log
          setChat(updatedChat);
          setChatState("idle");
          setChatInit(true);
        } else {
          // Added: Handle case when no chat history exists
          console.log("No chat history found");
          setChatInit(true);
          setChatState("idle");
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
        console.log("Sent client:connected");
        // Only request chat history if we don't already have it from HTTP
        if (chat.length === 0) {
          ws.current.send(JSON.stringify({ type: "client:chathist" }));
          console.log("Sent client:chathist");
        } else {
          console.log("Skipped requesting chat history - already have", chat.length, "messages");
        }
      });

      wss.addEventListener("message", (event) => {
        console.log("Raw WebSocket message received:", event.data);
        const data = JSON.parse(event.data);
        console.log("Parsed WebSocket message:", data.type, data);

        if (data?.type === "server:chathist") {
          const histdata = data?.data;
          if (!histdata) return;

          // Only update chat history if we don't already have messages
          if (chat.length === 0) {
            let updatedChat = [];
            for (let conv of histdata) {
              if (conv.prompt) {
                updatedChat.push({ message: conv.prompt, own: true, isLoading: false });
              }
              if (conv.response) {
                updatedChat.push({ message: conv.response, own: false, isLoading: false });
              }
            }
            console.log("updatechat", updatedChat);
            setChat(updatedChat);
            setChatState("idle");
            setChatInit(true);
          }
        } else if (data?.type === "server:response:start") {
          console.log("Response started");
          // Added: Initialize empty message for streaming
          setChat((prevChat) => [
            ...prevChat,
            { message: "", own: false, isLoading: true },
          ]);
        } else if (data?.type === "server:response:chunk") {
          console.log("Response chunk received:", data.chunk);
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
          console.log("Response ended");
          setChat((prevChat) => {
            const lastMessage = prevChat[prevChat.length - 1];
            if (lastMessage) {
              lastMessage.isLoading = false;
            }
            return [...prevChat];
          });
          setChatState("idle");
        } else if (data?.type === "server:response:restricted") {
          console.log("Response restricted:", data.message);
          setChat((prevChat) => [
            ...prevChat,
            { message: data.message, own: false, isLoading: false },
          ]);
          setChatState("idle");
        } else {
          console.log("Unknown message type:", data.type);
        }
      });

      // Added: Error handling for WebSocket
      wss.addEventListener("error", (error) => {
        console.error("WebSocket Error:", error);
      });

      wss.addEventListener("close", (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        console.log("Was clean close:", event.wasClean);
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
      console.error("WebSocket not connected, readyState:", ws.current?.readyState);
      return;
    }

    console.log("Sending message:", message);
    console.log("WebSocket readyState:", ws.current.readyState);
    
    setChat((prevChat) => [
      ...prevChat,
      { message, own: true, isLoading: false },
    ]);
    
    const messagePayload = {
      type: "client:prompt",
      prompt: message,
    };
    console.log("Message payload:", messagePayload);
    
    ws.current.send(JSON.stringify(messagePayload));
    console.log("Message sent via WebSocket");
    
    // Add a timeout to check if server responds
    setTimeout(() => {
      if (chatState === "busy") {
        console.warn("No response received from server after 10 seconds");
        console.log("WebSocket state:", ws.current?.readyState);
        // Reset chat state so user can try again
        setChatState("idle");
      }
    }, 10000);
    
    setMessage("");
    setChatState("busy");
  };

  const logoutUser = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/logout",
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