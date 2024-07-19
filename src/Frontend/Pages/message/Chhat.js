import React, { useState } from 'react'
import Markdown from "react-markdown";
import styles from "./message.module.css";

function Chhat({ text, own, isLoading = false }) {
    const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    });
  };
  return (
    <div className={`${styles.chat} ${own && styles.own}`}>
      <Markdown>{text}</Markdown>
      {!own && !isLoading && (
        <button onClick={handleCopy} className={styles.copyButton}>
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} style={{ marginRight: '8px', fontSize: '25px' ,color:'black'}}></i>

        </button>
      )}
      {isLoading && <div className={styles.loadCursor}></div>}
    </div>
  )
}

export default Chhat
