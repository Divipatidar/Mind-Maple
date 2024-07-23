import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./message.module.css";
import LoginContext from '../../context/context.js';
import axios from 'axios';
import Chhat from './Chhat.js';
import { Logo } from "../images/Logo.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';


function LoaderRipple() {
  return (
    <div className={styles["lds-ripple"]}></div>
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
    async function fetchData() {
      try {
        const data = await axios.get('https://mind-maple-xkvp.vercel.app/chat', {
          withCredentials: true,
        });
        setChatId(data.data.chatId);
      } catch (error) {
        console.log("Error Fetching Data", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (chatId !== null) {
      let wss = new WebSocket(`https://mind-maple-vjmo.vercel.app/?id=${chatId}`);
      ws.current = wss;

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
          setChat(updatedChat);
          setChatState("idle");
          setChatInit(true);
        } else if (data?.type === "server:response:start") {
          // Handle response start
        } else if (data?.type === "server:response:chunk") {
          setChat((prevchat) => {
            // prevchat.at(-1).message += data.chunk;
            // console.log("!!!", prevchat);
            // console.log("!!!", prevchat.slice(-1));
            return [
              ...prevchat.slice(0, -1),
              {
                message: `${prevchat.at(prevchat.length - 1).message}``${
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

      return () => {
        ws.current.close();
      };
    }
  }, [chatId]);

  const handleClick = () => {
    if (!message.trim()) return;

    setChat((prevChat) => [
      ...prevChat,
      { message, own: true, isLoading: false},
    ]);
    ws.current.send(JSON.stringify({
      type: "client:prompt",
      prompt: message,
    }));
    setMessage("");
    setChatState("busy");
  };

  const logoutUser = async () => {
    try {
      const { data } = await axios.get('https://mind-maple-xkvp.vercel.app/logout', {
        withCredentials: true,
      });
      if (data?.msg === "loggedout") {
        logout();
      }
    } catch (error) {
      console.log("Error in logout", error);
    }
  };

  return (
    <div className={styles.messageContainer}>
      <header>
        <div className={styles.logoContainer} onClick={() => navigate('/')}>
          <Logo />
          <div className={styles.headerText}>
            <h4>MindMaple</h4>
            <h6>A mental health chat assistance</h6>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <button onClick={() => navigate(loggedIn ? "/analysis" : "/login")}>
          <i className="fas fa-chart-bar" style={{ fontSize: '20px', paddingRight: '10px' }}></i>

            Analyse
          </button>

          <button onClick={loggedIn ? logoutUser : () => navigate("/login")}>
          <FontAwesomeIcon
                  icon={loggedIn ? faSignOutAlt : faArrowLeft}
                  style={{ fontSize: '20px', paddingRight: '10px' }}
                />
            {loggedIn ? "LogOut" : "Login"}
          </button>
        </div>
      </header>

      <main ref={mainRef} style={!chatInit || chat.length === 0 ? { display: "flex", alignItems: "center", justifyContent: "center" } : {}}>
        {!chatInit && <div className={styles.loadingChatInit}><LoaderRipple /></div>}
        {chatInit && chat.length === 0 && (
          <div className={styles.emptyChat}>
            No Previous Chat History! <br />
            Start a new conversation.
          </div>
        )}
        {chatInit && chat.map((message, index) => (
          <Chhat
            key={index}
            text={message.message}
            own={message.own}
            isLoading={message.isLoading}
          />
        ))}
      </main>

      <footer>
        <form onSubmit={(e) => { e.preventDefault(); }}>
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
            <i className="fas fa-paper-plane" style={{ fontSize: '38px', color: 'black' }}></i>

            </span>
          </button>
        </form>
      </footer>
    </div>
  );
}

export default Messagee;

