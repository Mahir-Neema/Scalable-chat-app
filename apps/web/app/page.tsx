"use client";

import React, { useState } from "react";
import classes from './page.module.css'
import { useSocket } from "../context/SocketProvider";

// { allMessages}:{ allMessages: string[] }
export default function page() {


  const { sendMessage, messages } = useSocket();
  const [message,setmessage] = useState('');

  const handleMessageSend = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setmessage(''); 
    }
  }

  return(<>
    <div className={classes["heading"]}>Scaleable Chat App</div>
    <div className={classes["container"]}>
      <div className={classes["messages"]}>
        {messages.map((msg,index) => (
          <li key={index} className={classes["msg-li"]}>{msg}</li>
        ))}
      </div>

      <div className={classes["userinputs"]}>
          <input onChange={(e) => setmessage(e.target.value)} placeholder="Message..." className={classes["chat-input"]}/>
          {message ? <button onClick={handleMessageSend} className={classes["button"]}>Send</button> : <button className={classes["dis-button"]}>Send</button>}
      </div>

    </div>
    </>
  )
}

