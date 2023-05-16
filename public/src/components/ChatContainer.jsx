import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "../utils/axios";
import { database } from "../utils/firebase";
import { ref, push, onValue, off } from "firebase/database";

import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const sender_id = localStorage.getItem("user_id")
    const response = await axios.post(recieveMessageRoute, {
      from: JSON.stringify(sender_id),
      to: JSON.stringify(currentChat.user_id),
    });
    setMessages(response.data);
  }, [currentChat]);

    useEffect(() => {
      
        const messagesRef = ref(database, `messages/${localStorage.getItem("user_id")}`);
      onValue(messagesRef,  (snapshot) => {
        const messages = snapshot.val();
        const messagesList = [];
        for (let key in messages) {
          messagesList.push({ ...messages[key] });
        }
        if(messagesList.length > 0){
          setArrivalMessage(messagesList[messagesList.length-1]);
        }
     
      // setMessages(messagesList);
    });

    return () => {
      off(messagesRef, "value");
    };
  }, []);


  const handleSendMsg = async (msg) => {
    const senderId = localStorage.getItem("user_id")
     const messagesRef = ref(database, `messages/${currentChat.user_id}`);

     push(messagesRef, {
        from_user_id: senderId,
        to_user_id: currentChat.user_id,
        message_text: msg,
        timestamp: Date.now(),
      });

    await axios.post(sendMessageRoute, {
      from: senderId,
      to: currentChat.user_id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ from_user_id: localStorage.getItem("user_id"), message_text: msg });
    setMessages(msgs);
  };


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    setArrivalMessage("")
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const call= async() =>{
      scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    call();
  }, [messages]);
  
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={currentChat?.avatar_url}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.name}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.from_user_id== localStorage.getItem("user_id") ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message_text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  
  @media screen and (max-width: 719px) {
    grid-template-rows: 8% 77% 15%;
    .chat-header {
      padding: 0.5rem;
      .user-details {
        gap: 0.5rem;
        .avatar {
          img {
            height: 2rem;
          }
        }
        .username {
          h3 {
            font-size: 1rem;
          }
        }
      }
    }
    .chat-messages {
      padding: 0.5rem;
      .message {
        .content {
          max-width: 80%;
          font-size: 0.9rem;
          padding: 0.8rem;
        }
      }
    }
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: white;
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }

    .message {
      display: flex;
      align-items: center;

      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #4f04ff21;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
